'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { Sale } from '../types/report';
import { Collection } from '@prisma/client';
import { currentUser } from '@clerk/nextjs/server';
import getUserById from '@/app/dashboard/action/get-user-by-id';

type FilterOption = {
  date: { start: string; end: string };
};

const getSales = async (
  option: FilterOption
): Promise<ActionResponse<Sale[]>> => {
  const { date } = option;

  const categoryFormatter = (category: Collection) => {
    if (category === 'DRINK') return 'Drink';
    if (category === 'FOOD') return 'Food';
    if (category === 'ROOM') return 'Room';
    return 'Other';
  };
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

    const rawOrders = await prisma.order.findMany({
      select: {
        reference: true,
        customer: {
          select: { user: { select: { firstName: true, lastName: true } } },
        },
        totalItems: true,
        totalPrice: true,
        orderDate: true,
        paymentMethod: true,
        category: true,
        cashier: {
          select: { firstName: true, lastName: true },
        },
      },
      where: {
        orderDate: {
          gte: date.start,
          lte: date.end,
        },
        ...(isAdmin ? {} : { cashierId: user.id }),
      },
    });

    const sales: Sale[] = rawOrders.map((order) => ({
      id: order.reference,
      customer: order.customer?.user
        ? `${order.customer.user.firstName} ${order.customer.user.lastName}`
        : 'Unknown',
      amount: Number(order.totalPrice) || 0,
      items: order.totalItems || 0,
      date: order.orderDate || 'Unknown',
      method: order.paymentMethod || 'Unknown',
      cashier: order.cashier
        ? `${order.cashier.firstName} ${order.cashier.lastName}`
        : 'Unassigned',
      category: categoryFormatter(order.category),
    }));

    return { success: true, data: sales };
  } catch (error) {
    console.error('Error fetching sales:', error);
    return {
      success: false,
      error: 'Failed to fetch sales. Please try again later.',
    };
  }
};

export default getSales;
