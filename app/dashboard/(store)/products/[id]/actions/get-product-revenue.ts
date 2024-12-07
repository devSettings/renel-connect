'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { Revenue } from '@/app/dashboard/(store)/orders/types/order';

interface ProductRevenue extends Revenue {
  totalSales: number;
}

const getProductRevenue = async ({
  id,
}: {
  id: string;
}): Promise<ActionResponse<ProductRevenue[]>> => {
  try {
    const aggregations = await prisma.orderItem.groupBy({
      by: ['orderDate'],
      where: {
        productId: id,
      },
      _sum: { totalPrice: true, quantity: true },
    });

    const revenue = aggregations.map((rev) => ({
      date: rev.orderDate,
      revenue: Number(rev._sum.totalPrice) || 0,
      totalSales: Number(rev._sum.quantity) || 0,
    }));

    return { success: true, data: revenue };
  } catch (error) {
    console.error('Error fetching product revenue:', error);
    return {
      success: false,
      error: 'Failed to fetch product revenue data. Please try again later.',
    };
  }
};

export default getProductRevenue;
