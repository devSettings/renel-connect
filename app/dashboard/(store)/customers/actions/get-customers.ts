'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { Customer } from '../types/customers';
import { Membership, UserStatus } from '@prisma/client';

interface Options {
  memberships?: Membership[];
  statuses?: UserStatus[];
  search?: string;
  pageSize?: number;
  currentPage?: number;
}

const getCustomers = async (
  options?: Options
): Promise<ActionResponse<Customer[]>> => {
  try {
    const {
      memberships,
      statuses,
      search,
      pageSize = 10,
      currentPage = 1,
    } = options || {};

    const skip = (currentPage - 1) * pageSize;

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
      where: {
        membership: { in: memberships },
        user: { status: { in: statuses } },
        ...(search && {
          OR: [
            { user: { firstName: { contains: search, mode: 'insensitive' } } },
            { user: { lastName: { contains: search, mode: 'insensitive' } } },
          ],
        }),
      },
      skip,
      take: pageSize,
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
    return {
      success: false,
      error: `Failed to create Customer: ${
        error instanceof Error ? error.message : 'Unknown Error'
      }`,
    };
  }
};

export default getCustomers;
