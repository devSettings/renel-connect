'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { ReportMetrics } from '../types/report';

const getReportMetrics = async (): Promise<ActionResponse<ReportMetrics>> => {
  try {
    const [aggregation, customerCount] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        _count: { id: true },
        _avg: { totalPrice: true },
      }),
      prisma.customer.count(),
    ]);

    const matrix: ReportMetrics = {
      totalNewCustomers: customerCount || 0,
      totalIncome: Number(aggregation._sum.totalPrice) || 0,
      averageSaleValue: aggregation._avg.totalPrice || 0,
      totalSales: aggregation._count.id || 0,
    };

    return { success: true, data: matrix };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to fetch Report metrics.' };
  }
};

export default getReportMetrics;
