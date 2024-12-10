'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { Revenue } from '../types/order';

const getRevenue = async (): Promise<ActionResponse<Revenue[]>> => {
  try {
    const aggregations = await prisma.order.groupBy({
      by: ['orderDate'],
      _sum: { totalPrice: true },
    });

    const revenue = aggregations.map((rev) => ({
      date: rev.orderDate,
      revenue: Number(rev._sum.totalPrice) || 0,
    }));
    console.log(revenue);
    return { success: true, data: revenue };
  } catch (error) {
    console.error('Error fetching revenue:', error);
    return {
      success: false,
      error: 'Failed to fetch revenue data. Please try again later.',
    };
  }
};

export default getRevenue;
