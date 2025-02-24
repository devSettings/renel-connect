'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';

import { currentUser } from '@clerk/nextjs/server';
import createAdjustmentSchema from '../schema/create-adjustment';
export async function createAdjustment(
  data: z.infer<typeof createAdjustmentSchema>
): Promise<ActionResponse> {
  const result = createAdjustmentSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.flatten().fieldErrors };
  }
  const user = await currentUser();
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  try {
    return await prisma.$transaction(async (tx) => {
      const product = await tx.inventoryProduct.findUnique({
        where: { productId: result.data.product },
        select: {
          productId: true,
          quantityInStock: true,
          averageUnitCostPrice: true,
          product: { select: { sellingPrice: true } },
        },
      });

      if (!product) {
        return { success: false, error: 'Product not found.' };
      }

      if (product.quantityInStock === 0) {
        return { success: false, error: 'Product is out of stock.' };
      }

      if (result.data.quantityAdjusted > product.quantityInStock) {
        return {
          success: false,
          error: 'Quantity adjusted exceeds available stock.',
        };
      }

      const newQuantity = Math.max(
        0,
        product.quantityInStock - result.data.quantityAdjusted
      );

      const [adjustment] = await Promise.all([
        tx.adjustment.create({
          data: {
            productId: product.productId,
            quantityAdjusted: result.data.quantityAdjusted,
            adjustmentDate: result.data.adjustmentDate
              .toISOString()
              .split('T')[0],
            userId: user.id,
            typeOfTransaction: result.data.typeOfTransaction,
          },
        }),
        tx.inventoryProduct.update({
          where: { productId: product.productId },
          data: { quantityInStock: newQuantity },
        }),
      ]);

      return { success: true, data: adjustment };
    });
  } catch (error) {
    console.error('Failed to create adjustment record:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while processing your request.',
    };
  } finally {
    revalidatePath('/dashboard/transactions');
  }
}
