'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { TypeOfTransaction } from '@prisma/client';
import { Transaction } from '../types/transactions';
import { format } from 'date-fns';
type FilterOptions = {
  type?: TypeOfTransaction;
  search?: string;
  pageSize?: number;
  currentPage?: number;
};

const getTransactions = async (
  options: FilterOptions = {}
): Promise<ActionResponse<Transaction[]>> => {
  const { type, search, pageSize = 100, currentPage = 1 } = options;
  const skip = (currentPage - 1) * pageSize;

  try {
    const adjustedPageSize = Math.floor(pageSize / 4);
    const remainder = pageSize % 4;

    const aggregations = await prisma.order.aggregate({
      _sum: { totalPrice: true },
    });
    const totalRevenue = aggregations._sum.totalPrice?.toNumber();

    const [expenses, incomes, losses, aquisitions] = await Promise.all([
      prisma.expense.findMany({
        select: {
          id: true,
          title: true,
          amount: true,
          typeOfTransaction: true,
          expenseDate: true,
          madeBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        where: {
          ...(type && { typeOfTransaction: type }),
          ...(search && { title: { contains: search } }),
        },
        skip,
        take: adjustedPageSize + remainder,
      }),
      prisma.income.findMany({
        select: {
          id: true,
          title: true,
          amount: true,
          typeOfTransaction: true,
          incomeDate: true,
          madeBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        where: {
          ...(type && { typeOfTransaction: type }),
          ...(search && { title: { contains: search } }),
        },
        skip,
        take: adjustedPageSize,
      }),

      prisma.lost.findMany({
        select: {
          id: true,
          totalLost: true,
          product: { select: { name: true } },
          lostDate: true,
          typeOfTransaction: true,
          madeBy: { select: { firstName: true, lastName: true } },
        },
        where: {
          ...(type && { typeOfTransaction: type }),
        },
        skip,
        take: adjustedPageSize,
      }),
      prisma.aquisition.findMany({
        select: {
          id: true,
          aquisitionDate: true,
          product: { select: { name: true } },
          typeOfTransaction: true,
          totalCost: true,
          madeBy: { select: { firstName: true, lastName: true } },
        },
        where: {
          ...(type && { typeOfTransaction: type }),
        },
        skip,
        take: adjustedPageSize,
      }),
      prisma.expense.count({
        where: {
          ...(type && { typeOfTransaction: type }),
          ...(search && { title: { contains: search } }),
        },
      }),
      prisma.income.count({
        where: {
          ...(type && { typeOfTransaction: type }),
          ...(search && { title: { contains: search } }),
        },
      }),
      prisma.lost.count({
        where: {
          ...(type && { typeOfTransaction: type }),
        },
      }),
      prisma.aquisition.count({
        where: {
          ...(type && { typeOfTransaction: type }),
        },
      }),
    ]);

    const formatTransaction = (transaction: any) => ({
      id: transaction.id,
      title: transaction.title,
      amount: Number(transaction.amount),
      type: transaction.typeOfTransaction,
      date:
        transaction.expenseDate ||
        transaction.incomeDate ||
        transaction.lostDate ||
        transaction.aquisitionDate,
      madeBy: transaction.madeBy
        ? `${transaction.madeBy.firstName} ${transaction.madeBy.lastName}`
        : 'Unknown',
    });

    const transactions = [
      ...expenses.map(formatTransaction),
      ...incomes.map(formatTransaction),
      ...losses.map((loss) => ({
        id: loss.id,
        title: loss.product?.name || 'Unknown Product',
        amount: Number(loss.totalLost),
        type: loss.typeOfTransaction,
        date: loss.lostDate,
        madeBy: loss.madeBy
          ? `${loss.madeBy.firstName} ${loss.madeBy.lastName}`
          : 'Unknown',
      })),
      ...aquisitions.map((aquisition) => ({
        id: aquisition.id,
        title: aquisition.product?.name || 'Unknown Product',
        amount: Number(aquisition.totalCost),
        type: aquisition.typeOfTransaction,
        date: aquisition.aquisitionDate,
        madeBy: aquisition.madeBy
          ? `${aquisition.madeBy.firstName} ${aquisition.madeBy.lastName}`
          : 'Unknown',
      })),
    ];
    const currentDate = format(new Date(), 'yyyy-MM-dd');

    // Add total revenue as an income transaction
    if (totalRevenue) {
      transactions.push({
        id: 'KKVSH009NS1',
        title: 'Total Revenue',
        amount: totalRevenue,
        type: 'INCOME',
        date: currentDate,
        madeBy: 'System',
      });
    }

    if (!transactions || transactions.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    return {
      success: true,
      data: transactions,
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return {
      success: false,

      error: `Failed to fetch transactions: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    };
  }
};

export default getTransactions;
