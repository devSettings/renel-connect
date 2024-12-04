'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';

type ProductTypeMetrics = {
  inventory: number;
  non_inventory: number;
  service: number;
  digital: number;
};

const getProductTypeMetrics = async (): Promise<
  ActionResponse<ProductTypeMetrics>
> => {
  try {
    // Group by `type` for products
    const aggregations = await prisma.product.groupBy({
      by: ['type'],
      _count: { id: true },
    });

    // Initialize metrics
    const productTypeMetrics = {
      inventory: 0,
      non_inventory: 0,
      service: 0,
      digital: 0,
    };

    // Populate metrics from aggregations
    aggregations.forEach((group) => {
      if (group.type === 'INVENTORY') {
        productTypeMetrics.inventory = group._count.id;
      } else if (group.type === 'NON_INVENTORY') {
        productTypeMetrics.non_inventory = group._count.id;
      } else if (group.type === 'SERVICE') {
        productTypeMetrics.service = group._count.id;
      } else if (group.type === 'DIGITAL') {
        productTypeMetrics.digital = group._count.id;
      }
    });

    return { success: true, data: productTypeMetrics };
  } catch (error) {
    console.error('Error fetching product type metrics:', error);
    return { success: false, error: 'Failed to fetch product type metrics' };
  }
};

export default getProductTypeMetrics;
