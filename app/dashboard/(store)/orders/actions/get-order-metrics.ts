'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { OrderMetrics } from '../types/order';

const getOrderMetrics = async (): Promise<ActionResponse<OrderMetrics>> => {
  try {
    const [aggregation, customerCount] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        _count: { id: true },
        _avg: { totalPrice: true },
      }),
      prisma.customer.count(),
    ]);

    const matrix: OrderMetrics = {
      totalCustomers: customerCount || 0,
      totalIncome: Number(aggregation._sum.totalPrice) || 0,
      averageSpent: aggregation._avg.totalPrice?.toNumber() || 0,
      totalOrders: aggregation._count.id || 0,
    };

    return { success: true, data: matrix };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to fetch order metrics.' };
  }
};

export default getOrderMetrics;
