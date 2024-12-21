'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { ReportMetrics } from '../types/report';
import { format } from 'date-fns';

const currentDate = format(
  new Date(new Date().setHours(new Date().getHours() - 6)),
  'yyyy-MM-dd'
);

type FilterOptions = {
  date: {
    from: string;
    to: string;
  };
};

const getReportMetrics = async (): Promise<ActionResponse<ReportMetrics>> => {
  try {
    const [aggregation, customerCount] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        _count: { id: true },
        _avg: { totalPrice: true },
        where: {
          orderDate: currentDate,
        },
      }),
      prisma.customer.count({
        where: {
          createdDate: currentDate,
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
