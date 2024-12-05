'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { ProductStatus, ProductType } from '@prisma/client';

type Product = {
  id: string;
  name: string;
  sellingPrice: number;
  type: ProductType;
  status: ProductStatus;
  category: string;
  reOrderLevel: number;
};

const getProductById = async (id: string): Promise<ActionResponse<Product>> => {
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
export default getProductById;
