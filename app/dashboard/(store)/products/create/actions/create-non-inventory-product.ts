'use server';

import 'server-only';

import prisma from '@/prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import createNonInventoryProductSchema from '../schema/create-non-inventory-product';
import generateProductSku from './generate-product-sku';
import { ActionResponse } from '@/app/types/action-reponse';

type FormData = z.infer<typeof createNonInventoryProductSchema>;

const createNonInventoryProduct = async (
  data: FormData
): Promise<ActionResponse> => {
  const sku = await generateProductSku();
  const result = createNonInventoryProductSchema.safeParse(data);

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
        createdById: 'cm4ctamdh000249i0jm2qpfqu',
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
