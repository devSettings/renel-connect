'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import createLostSchema from '../schema/create-lost';
import { currentUser } from '@clerk/nextjs/server';
export async function createLost(
  data: z.infer<typeof createLostSchema>
): Promise<ActionResponse> {
  const result = createLostSchema.safeParse(data);
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

      if (result.data.quantityLost > product.quantityInStock) {
        return {
          success: false,
          error: 'Quantity lost exceeds available stock.',
        };
      }

      const newQuantity = Math.max(
        0,
        product.quantityInStock - result.data.quantityLost
      );

      const [lost] = await Promise.all([
        tx.lost.create({
          data: {
            productId: product.productId,
            description: result.data.description,
            quantityOfItems: result.data.quantityLost,
            lostDate: result.data.lostDate.toISOString().split('T')[0],
            userId: user.id,
            unitPrice: product.product.sellingPrice,
            totalLost:
              Number(product.averageUnitCostPrice) * result.data.quantityLost,
          },
        }),
        tx.inventoryProduct.update({
          where: { productId: product.productId },
          data: { quantityInStock: newQuantity },
        }),
      ]);

      return { success: true, data: lost };
    });
  } catch (error) {
    console.error('Failed to create lost record:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while processing your request.',
    };
  } finally {
    revalidatePath('/dashboard/transactions');
  }
}
