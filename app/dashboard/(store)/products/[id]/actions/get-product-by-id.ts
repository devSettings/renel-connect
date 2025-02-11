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

type InventoryProduct = {
  id: string;
  name: string;
  type: ProductType;
  reOrderLevel: number;
  sellingPrice: number;
  status: ProductStatus;
  category: string;
};

type NonInventoryProduct = {
  id: string;
  name: string;
  type: ProductType;
  sellingPrice: number;
  status: ProductStatus;
  category: string;
};

const getProductById = async (id: string): Promise<ActionResponse> => {
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
      reOrderLevel:
        rawProduct.type === 'INVENTORY'
          ? rawProduct.InventoryProduct[0].reorderLevel
          : 0,
    };
    return { success: true, data: product };
  } catch (error) {
    return { success: false, error: 'Can not fetch product' };
  }
};
export default getProductById;
