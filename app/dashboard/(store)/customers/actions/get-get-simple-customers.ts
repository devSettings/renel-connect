'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';

type FilterOption = {
  page?: number;
  itemsPerpage?: number;
  search?: string;
};
export type SimpleCustomer = {
  id: string;
  firstName: string;
  lastName: string;
};

const getSimpleCustomers = async (
  option: FilterOption = {}
): Promise<ActionResponse<SimpleCustomer[]>> => {
  const { search, page = 1, itemsPerpage = 10 } = option;
  const skip = (page - 1) * itemsPerpage;

  try {
    const users = await prisma.user.findMany({
      where: {
        status: 'ACTIVE',
        Role: 'CUSTOMER',
        OR: search
          ? [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      select: {
        firstName: true,
        lastName: true,
        customer: { select: { id: true } },
      },
      skip,
      take: itemsPerpage,
    });

    const customers = users.map((user) => ({
      id: user.customer?.id!,
      firstName: user.firstName,
      lastName: user.lastName,
    }));

    return { success: true, data: customers };
  } catch (error) {
    console.error('Error fetching customers:', error);
    return {
      success: false,
      error: 'Failed to fetch customers. Please try again later.',
    };
  }
};

export default getSimpleCustomers;
