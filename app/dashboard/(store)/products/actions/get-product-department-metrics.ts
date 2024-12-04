'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';

type ProductDepartmentMetrics = {
  food: number;
  drink: number;
  room: number;
  other: number;
};

const getProductDepartmentMetrics = async (): Promise<
  ActionResponse<ProductDepartmentMetrics>
> => {
  try {
    // Group by `department` for products
    const aggregations = await prisma.product.groupBy({
      by: ['department'],
      _count: { id: true },
    });

    // Initialize metrics
    const productDepartmentMetrics = {
      food: 0,
      drink: 0,
      room: 0,
      other: 0,
    };

    // Populate metrics from aggregations
    aggregations.forEach((group) => {
      if (group.department === 'FOOD') {
        productDepartmentMetrics.food = group._count.id;
      } else if (group.department === 'DRINK') {
        productDepartmentMetrics.drink = group._count.id;
      } else if (group.department === 'ROOM') {
        productDepartmentMetrics.room = group._count.id;
      } else {
        productDepartmentMetrics.other = group._count.id;
      }
    });

    return { success: true, data: productDepartmentMetrics };
  } catch (error) {
    console.error('Error fetching product department metrics:', error);
    return {
      success: false,
      error: 'Failed to fetch product department metrics',
    };
  }
};

export default getProductDepartmentMetrics;
