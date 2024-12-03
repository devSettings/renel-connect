'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { CustomerMembershipMetrics } from '../types/customers';

const getCustomerMembershipMetrics = async (): Promise<
  ActionResponse<CustomerMembershipMetrics>
> => {
  try {
    // Group by `membership` for customers
    const aggregations = await prisma.customer.groupBy({
      by: ['membership'],
      _count: { id: true },
    });

    // Initialize metrics
    const membershipMetrics = {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
    };

    // Populate metrics from aggregations
    aggregations.forEach((group) => {
      if (group.membership === 'BRONZE') {
        membershipMetrics.bronze = group._count.id;
      } else if (group.membership === 'SILVER') {
        membershipMetrics.silver = group._count.id;
      } else if (group.membership === 'GOLD') {
        membershipMetrics.gold = group._count.id;
      } else if (group.membership === 'PLATINUM') {
        membershipMetrics.platinum = group._count.id;
      }
    });

    return { success: true, data: membershipMetrics };
  } catch (error) {
    console.error('Error fetching customer membership metrics:', error);
    return {
      success: false,
      error: 'Failed to fetch customer membership metrics',
    };
  }
};

export default getCustomerMembershipMetrics;
