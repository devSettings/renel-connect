'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { ReportMetrics } from '../types/report';
import { currentUser } from '@clerk/nextjs/server';
import getUserById from '@/app/dashboard/action/get-user-by-id';

type FilterOption = {
  date: { start: string; end: string };
};

const getReportMetrics = async (
  filterOption: FilterOption
): Promise<ActionResponse<ReportMetrics>> => {
  if (!filterOption) {
    console.error('No filter option provided');
    return {
      success: false,
      error: 'No filter option provided. Please provide a valid date range.',
    };
  }

  const { date } = filterOption;
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const userRole = await getUserById(user.id);
    if (!userRole.success) {
      return { success: false, error: 'User role not found' };
    }

    const isAdmin = userRole.data.Role === 'ADMIN';

    const [aggregation, customerCount] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        _count: { id: true },
        _avg: { totalPrice: true },
        where: {
          orderDate: {
            gte: date.start,
            lte: date.end,
          },
          ...(isAdmin ? {} : { cashierId: user.id }),
        },
      }),
      prisma.customer.count({
        where: {
          createdDate: {
            gte: date.start,
            lte: date.end,
          },
        },
      }),
    ]);

    const matrix: ReportMetrics = {
      totalNewCustomers: customerCount || 0,
      totalIncome: Number(aggregation._sum.totalPrice) || 0,
      averageSaleValue: Number(aggregation._avg.totalPrice) || 0,
      totalSales: aggregation._count.id || 0,
    };

    return { success: true, data: matrix };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to fetch Report metrics.' };
  }
};

export default getReportMetrics;
