'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { ProductStatus, ProductType } from '@prisma/client';

export type NonInventoryProduct = {
  id: string;
  name: string;
  type: ProductType;
  sellingPrice: number;
  status: ProductStatus;
  category: string;
};
const getNonInventoryProductById = async (
  id: string
): Promise<ActionResponse<NonInventoryProduct>> => {
  try {
    const isProduct = await prisma.product.findUnique({
      where: { id },
      select: {
        sellingPrice: true,
        id: true,
        categoryId: true,
        name: true,
        type: true,
        status: true,
      },
    });

    if (!isProduct) {
      return { success: false, error: 'Product Not Found' };
    }

    return {
      success: true,
      data: {
        id: isProduct.id,
        name: isProduct.name,
        sellingPrice: isProduct.sellingPrice,
        category: isProduct.categoryId,
        type: isProduct.type,
        status: isProduct.status,
      },
    };
  } catch (error) {
    return { success: false, error: 'Error fetching products' };
  }
};
export default getNonInventoryProductById;
