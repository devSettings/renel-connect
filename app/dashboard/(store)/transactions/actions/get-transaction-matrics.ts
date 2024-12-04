'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { TransactionMetrics } from '../types/transactions';

const getTransactionMetrics = async (): Promise<
  ActionResponse<TransactionMetrics>
> => {
  try {
    const [_lost, _income, _aquisition, _expense] = await Promise.all([
      prisma.lost.aggregate({
        _sum: { totalLost: true },
      }),
      prisma.income.aggregate({
        _sum: { amount: true },
      }),

      prisma.aquisition.aggregate({
        _sum: { totalCost: true },
      }),

      prisma.expense.aggregate({
        _sum: { amount: true },
      }),
    ]);

    const transactions = {
      income: Number(_income._sum.amount) || 0,
      expenses: Number(_expense._sum.amount) || 0,
      aquisitions: Number(_aquisition._sum.totalCost) || 0,
      loses: Number(_lost._sum.totalLost) || 0,
    };
    return { success: true, data: transactions };
  } catch (error) {
    return { success: false, error: 'Failed to fetch..' };
  }
};

export default getTransactionMetrics;
