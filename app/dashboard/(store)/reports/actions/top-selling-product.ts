'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { format } from 'date-fns';

const currentDate = format(new Date(), 'yyyy-MM-dd');

const getTopSellingProduct = async (): Promise<
  ActionResponse<{ name: string; revenue: number }[]>
> => {
  try {
    const products = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, unitPrice: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
      where: {
        orderDate: currentDate,
      },
    });

    const productDetails = await prisma.product.findMany({
      where: { id: { in: products.map((p) => p.productId) } },
      select: { id: true, name: true },
    });

    const productMap = new Map(productDetails.map((p) => [p.id, p.name]));

    const topProducts = products.map((p) => ({
      name: productMap.get(p.productId) || 'Unknown',
      revenue: p._sum.quantity! * (Number(p._sum.unitPrice) || 0),
    }));

    return { success: true, data: topProducts };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: 'An unknown error occurred' };
    }
  }
};

export default getTopSellingProduct;
