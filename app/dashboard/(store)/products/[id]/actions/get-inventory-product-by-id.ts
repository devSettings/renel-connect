'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { ProductStatus, ProductType } from '@prisma/client';

export type InventoryProduct = {
  id: string;
  name: string;
  type: ProductType;
  reOrderLevel: number;
  sellingPrice: number;
  status: ProductStatus;
  category: string;
};

const getInventoryProductById = async (
  id: string
): Promise<ActionResponse<InventoryProduct>> => {
  try {
    const rawProduct = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        name: true,
        status: true,
        category: true,
        InventoryProduct: {
          select: {
            reorderLevel: true,
            averageUnitCostPrice: true,
            productId: true,
          },
        },
        sellingPrice: true,
      },
    });

    if (!rawProduct) {
      return { success: false, error: 'Product Not Found' };
    }

    const product = {
      id: rawProduct.id,
      name: rawProduct.name,
      sellingPrice: rawProduct.sellingPrice,
      type: rawProduct.type,
      status: rawProduct.status,
      category: rawProduct.category.id,
      reOrderLevel: rawProduct.InventoryProduct[0].reorderLevel,
    };
    return { success: true, data: product };
  } catch (error) {
    return { success: false, error: 'Can not fetch product' };
  }
};
export default getInventoryProductById;
