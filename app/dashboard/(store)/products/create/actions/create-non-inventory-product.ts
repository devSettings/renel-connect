'use server';

import 'server-only';

import prisma from '@/prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import createNonInventoryProductSchema from '../schema/create-non-inventory-product';
import generateProductSku from './generate-product-sku';
import { ActionResponse } from '@/app/types/action-reponse';
import { currentUser } from '@clerk/nextjs/server';
type FormData = z.infer<typeof createNonInventoryProductSchema>;

const createNonInventoryProduct = async (
  data: FormData
): Promise<ActionResponse> => {
  const sku = await generateProductSku();
  const result = createNonInventoryProductSchema.safeParse(data);
  const user = await currentUser();
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (!result?.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  try {
    const product = await prisma.product.create({
      data: {
        sku: result.data.sku || sku!,
        name: result.data.name,
        sellingPrice: result.data.sellingPrice,
        status: result.data.status,
        categoryId: result.data.category,
        type: 'NON_INVENTORY',
        slug: result.data.name.toLowerCase().replace(/ /g, '-'),
        createdById: user.id,
        department: 'OTHER',
      },
    });
    revalidatePath('/dashboard/products');
    return { success: true, data: product };
  } catch (error) {
    return { success: false, error: `${String(error)}` };
  }
};

export default createNonInventoryProduct;
