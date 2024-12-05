'use server';
import 'server-only';

import prisma from '@/prisma/client';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { editInventoryProductSchema } from '../schema/edit-inventory-product';
type FormData = z.infer<typeof editInventoryProductSchema>;

const editInventoryProduct = async (data: FormData) => {
  const result = editInventoryProductSchema.safeParse(data);

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

    // const existProduct = await prisma.product.findUnique({
    //   where: { slug: result.data.name.toLowerCase().replace(/ /g, '-') },
    // });

    // if (existProduct) {
    //   return { success: false, error: 'Product name already exist' };
    // }

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
      prisma.inventoryProduct.update({
        where: { productId: result.data.id },
        data: { reorderLevel: result.data.reorderLevel },
      }),
    ]);
    revalidatePath('/dashboard/products');
    return { success: true, data: 'Sucess' };
  } catch (error) {
    return { success: false, error: `Failed To Edit Product` };
  }
};

export default editInventoryProduct;
