'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';

type CustomerStatusMetrics = {
  active: number;
  inactive: number;
  banned: number;
  suspended: number;
};

const getCustomerStatusMetrics = async (): Promise<
  ActionResponse<CustomerStatusMetrics>
> => {
  try {
    // Group by `status` for customers
    const aggregations = await prisma.user.groupBy({
      by: ['status'],
      _count: { id: true },
      where: { Role: 'CUSTOMER' },
    });

    // Total number of customers
    const totalCustomers = await prisma.user.count({
      where: { Role: 'CUSTOMER' },
    });

    // Initialize metrics
    const customerMetrics = {
      active: 0,
      inactive: 0,
      banned: 0,
      suspended: 0,
      // total: totalCustomers,
    };

    // Populate metrics from aggregations
    aggregations.forEach((group) => {
      if (group.status === 'ACTIVE') {
        customerMetrics.active = group._count.id;
      } else if (group.status === 'INACTIVE') {
        customerMetrics.inactive = group._count.id;
      } else if (group.status === 'BANNED') {
        customerMetrics.banned = group._count.id;
      } else if (group.status === 'SUSPENDED') {
        customerMetrics.suspended = group._count.id;
      }
    });

    return { success: true, data: customerMetrics };
  } catch (error) {
    console.error('Error fetching customer metrics:', error);
    return { success: false, error: 'Failed to fetch customer status metrics' };
  }
};

export default getCustomerStatusMetrics;
