'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { Customer } from '../types/customers';

const getCustomers = async (): Promise<ActionResponse<Customer[]>> => {
  try {
    const rawCustomers = await prisma.customer.findMany({
      select: {
        user: { select: { firstName: true, lastName: true, status: true } },
        lastPurchaseDate: true,
        totalOrders: true,
        totalSpend: true,
        membership: true,
        id: true,
        phoneNumber: true,
      },
    });

    const customers = rawCustomers.map((customer) => {
      return {
        id: customer.id,
        lastPurchaseDate: customer.lastPurchaseDate || null,
        membership: customer.membership,
        phoneNumber: customer.phoneNumber,
        name: `${customer.user.firstName} ${customer.user.lastName}`,
        totalOrders: customer.totalOrders,
        totalSpend: Number(customer.totalSpend),
        status: customer.user.status,
      };
    });
    return { success: true, data: customers };
  } catch (error) {
    return { success: false, error: 'Faild to fetch customers' };
  }
};

export default getCustomers;
