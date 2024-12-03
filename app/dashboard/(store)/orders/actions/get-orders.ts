'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { Order } from '../types/order';

const getOrders = async (): Promise<ActionResponse<Order[]>> => {
  try {
    const rawOrders = await prisma.order.findMany({
      select: {
        reference: true,
        customer: {
          select: { user: { select: { firstName: true, lastName: true } } },
        },
        totalItems: true,
        totalPrice: true,
        source: true,
        orderDate: true,
        paymentMethod: true,
        cashier: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    const orders: Order[] = rawOrders.map((order) => ({
      id: order.reference,
      customer: order.customer?.user
        ? `${order.customer.user.firstName} ${order.customer.user.lastName}`
        : 'Unknown',
      amount: Number(order.totalPrice) || 0,
      items: order.totalItems || 0,
      date: order.orderDate || 'Unknown',
      method: order.paymentMethod || 'Unknown',
      source: order.source || 'Unknown',
      cashier: order.cashier
        ? `${order.cashier.firstName} ${order.cashier.lastName}`
        : 'Unassigned',
    }));

    return { success: true, data: orders };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      success: false,
      error: 'Failed to fetch orders. Please try again later.',
    };
  }
};

export default getOrders;
