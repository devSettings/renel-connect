'use server';

import 'server-only';

import prisma from '@/prisma/client';
import { revalidatePath } from 'next/cache';
import generateProductSku from './generate-product-sku';
import createServiceProductSchema from '../schema/create-service-product';
import { z } from 'zod';
import { ActionResponse } from '@/app/types/action-reponse';
type FormData = z.infer<typeof createServiceProductSchema>;
const createServiceProduct = async (
  data: FormData
): Promise<ActionResponse> => {
  const sku = await generateProductSku();
  const result = createServiceProductSchema.safeParse(data);

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
        type: 'SERVICE',
        slug: result.data.name.toLowerCase().replace(/ /g, '-'),
        createdById: '3',
        ServicesProduct: {
          create: {
            serviceDuration: result.data.serviceDuration,
            serviceLocation: result.data.serviceLocation,
          },
        },
      },
    });
    revalidatePath('/dashboard/products');
    return { success: true, data: product };
  } catch (error) {
    return { success: false, error: `${String(error)}` };
  }
};

export default createServiceProduct;
