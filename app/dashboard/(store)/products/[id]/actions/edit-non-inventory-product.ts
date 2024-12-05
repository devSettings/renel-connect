'use server';
import 'server-only';

import prisma from '@/prisma/client';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { editInventoryProductSchema } from '../schema/edit-inventory-product';
import editNonInventoryProductSchema from '../schema/edit-non-inventory-product';
type FormData = z.infer<typeof editNonInventoryProductSchema>;

const editNonInventoryProduct = async (data: FormData) => {
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

    const existProduct = await prisma.product.findUnique({
      where: { name: result.data.name },
    });

    if (existProduct && existProduct.id !== result.data.id) {
      return { success: false, error: 'Product name already exist' };
    }

    await prisma.product.update({
      where: { id: result.data.id },
      data: {
        name: result.data.name,
        sellingPrice: result.data.sellingPrice,
        status: result.data.status,
        categoryId: result.data.category,
        slug: result.data.name.toLowerCase().replace(/ /g, '-'),
      },
    }),
      revalidatePath('/dashboard/products');
    return { success: true, data: 'Sucess' };
  } catch (error) {
    return { success: false, error: `Failed To Edit Product` };
  }
};

export default editNonInventoryProduct;
