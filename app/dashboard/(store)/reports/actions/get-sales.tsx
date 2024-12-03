'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { Sale } from '../types/report';
import { OrderCategory } from '@prisma/client';

const getSales = async (): Promise<ActionResponse<Sale[]>> => {
  const categoryFormatter = (category: OrderCategory) => {
    if (category === 'DRINK') return 'Drink';
    if (category === 'FOOD') return 'Food';
    if (category === 'ROOM') return 'Room';
    return 'Other';
  };
  try {
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
