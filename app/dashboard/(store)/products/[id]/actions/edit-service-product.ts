'use server';
import 'server-only';

import prisma from '@/prisma/client';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import editServiceProductSchema from '../schema/edit-service-product';
type FormData = z.infer<typeof editServiceProductSchema>;

const editServiceProduct = async (data: FormData) => {
  const result = editServiceProductSchema.safeParse(data);

  if (!result?.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  try {
    const isValidId = await prisma.product.findUnique({
      where: { id: result.data.id },
    });

    if (!isValidId) {
      return { success: false, error: 'Product id not found' };
    }

    const existProduct = await prisma.product.findUnique({
      where: { slug: result.data.name.toLowerCase().replace(/ /g, '-') },
    });

    if (existProduct && existProduct.id !== result.data.id) {
      return { success: false, error: 'Product name already exist' };
    }

    await prisma.$transaction([
      prisma.product.update({
        where: { id: result.data.id },
        data: {
          name: result.data.name,
          sellingPrice: result.data.sellingPrice,
          status: result.data.status,
          categoryId: result.data.category,
          slug: result.data.name.toLowerCase().replace(/ /g, '-'),
        },
      }),
      prisma.servicesProduct.update({
        where: { productId: result.data.id },
        data: {
          serviceDuration: result.data.serviceDuration,
          serviceLocation: result.data.serviceLocation,
        },
      }),
    ]);
    revalidatePath('/dashboard/products');
    return { success: true, data: 'Sucess' };
  } catch (error) {
    return { success: false, error: `Failed To Edit Product` };
  }
};

export default editServiceProduct;
