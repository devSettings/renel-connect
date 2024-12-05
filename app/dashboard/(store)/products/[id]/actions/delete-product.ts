'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { ProductType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const deleteProduct = async (id: string): Promise<ActionResponse> => {
  let producyType: ProductType;
  try {
    const isProducExist = await prisma.product.findUnique({
      where: { id },
      select: { type: true },
    });

    if (!isProducExist)
      return {
        success: false,
        error: 'Product not found.',
      };

    producyType = isProducExist.type;

    if (producyType === 'INVENTORY') {
      await prisma.$transaction([
        prisma.inventoryProduct.delete({ where: { productId: id } }),
        prisma.product.delete({ where: { id } }),
      ]);
    } else if (producyType === 'SERVICE') {
      await prisma.$transaction([
        prisma.servicesProduct.delete({ where: { productId: id } }),
        prisma.product.delete({ where: { id } }),
      ]);
    } else {
      await prisma.product.delete({ where: { id } });
    }
    revalidatePath('/dashboard/products');
    return { success: true, data: 'Product deleted' };
  } catch (error) {
    return { success: false, error: 'Product can not be deleted' };
  }
};
export default deleteProduct;
