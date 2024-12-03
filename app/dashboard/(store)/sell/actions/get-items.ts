'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { Product } from '../types/product';

type FilterOption = {
  pageSize?: number;
  currentPage?: number;
  search?: string;
};
const INFINITE_STOCK = Number.MAX_SAFE_INTEGER;

const getItems = async (
  options: FilterOption = {}
): Promise<ActionResponse<Product[]>> => {
  const { search, pageSize = 10, currentPage = 1 } = options;
  const skip = (currentPage - 1) * pageSize;

  try {
    const productsRaw = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sellingPrice: true,
        category: { select: { name: true } },
        InventoryProduct: {
          select: { productId: true, quantityInStock: true },
        },
        type: true,
      },
      where: {
        status: 'ACTIVE',
        name: { contains: search },
      },
      skip,
      take: pageSize,
    });

    const products = productsRaw.map((product) => ({
      id: product.id,
      name: product.name,
      sellingPrice: product.sellingPrice,
      category: product.category.name,
      quantityInStock:
        product.type === 'INVENTORY'
          ? product.InventoryProduct.find((p) => p.productId === product.id)
              ?.quantityInStock || 0
          : INFINITE_STOCK,
    }));
    console.log(products);
    return { success: true, data: products };
  } catch (error) {
    return {
      success: false,
      error: `An unexpected error occurred while processing your request. ${error}`,
    };
  }
};
export default getItems;
