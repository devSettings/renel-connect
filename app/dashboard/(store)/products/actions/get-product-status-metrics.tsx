'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';

type ProductStatusMetrics = {
  active: number;
  inactive: number;
  draft: number;
  archived: number;
};

const getProductStatusMetrics = async (): Promise<
  ActionResponse<ProductStatusMetrics>
> => {
  try {
    // Group by `status` for products
    const aggregations = await prisma.product.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    // Initialize metrics
    const productMetrics = {
      active: 0,
      inactive: 0,
      draft: 0,
      archived: 0,
    };

    // Populate metrics from aggregations
    aggregations.forEach((group) => {
      if (group.status === 'ACTIVE') {
        productMetrics.active = group._count.id;
      } else if (group.status === 'INACTIVE') {
        productMetrics.inactive = group._count.id;
      } else if (group.status === 'ARCHIVED') {
        productMetrics.archived = group._count.id;
      } else if (group.status === 'DRAFT') {
        productMetrics.draft = group._count.id;
      }
    });

    return { success: true, data: productMetrics };
  } catch (error) {
    console.error('Error fetching product metrics:', error);
    return { success: false, error: 'Failed to fetch product status metrics' };
  }
};

export default getProductStatusMetrics;
