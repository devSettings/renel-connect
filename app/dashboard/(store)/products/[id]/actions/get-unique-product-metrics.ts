'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';

type UniqueProductMetrics = {
  quantityLost: number;
  totalRevenue: number;
  quantitySold: number;
  quantityInStock: number;
};

const getUniqueProductMetrics = async (
  id: string
): Promise<ActionResponse<UniqueProductMetrics>> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        InventoryProduct: { select: { quantityInStock: true } },
      },
    });

    if (!product) {
      return { success: false, error: 'Product Not Found' };
    }

    const quantityLost = await prisma.lost.aggregate({
      where: { productId: id },
      _sum: { quantityOfItems: true },
    });

    const orderSummary = await prisma.orderItem.aggregate({
      where: { productId: id },
      _sum: { totalPrice: true, quantity: true },
    });

    return {
      success: true,
      data: {
        quantityLost: quantityLost._sum.quantityOfItems ?? 0,
        totalRevenue: orderSummary._sum.totalPrice?.toNumber() ?? 0,
        quantitySold: orderSummary._sum.quantity ?? 0,
        quantityInStock: product.InventoryProduct?.[0]?.quantityInStock ?? 0,
      },
    };
  } catch (error) {
    console.error('Error fetching product summary:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Unexpected error occurred',
    };
  }
};

export default getUniqueProductMetrics;
