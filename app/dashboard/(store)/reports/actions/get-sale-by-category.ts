'use server';
import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { format } from 'date-fns';

const currentDate = format(
  new Date(new Date().setHours(new Date().getHours() - 6)),
  'yyyy-MM-dd'
);

const getSaleByCategory = async (): Promise<ActionResponse> => {
  try {
    const initalData = {
      room: 0,
      drink: 0,
      food: 0,
      other: 0,
    };

    const aggregations = await prisma.order.groupBy({
      by: ['category'],
      _sum: { totalPrice: true },
      where: {
        orderDate: currentDate,
      },
    });

    aggregations.forEach((group) => {
      if (group.category === 'ROOM') {
        initalData.room = group._sum.totalPrice?.toNumber() ?? 0;
      } else if (group.category === 'DRINK') {
        initalData.drink = group._sum.totalPrice?.toNumber() ?? 0;
      } else if (group.category === 'FOOD') {
        initalData.food = group._sum.totalPrice?.toNumber() ?? 0;
      } else {
        initalData.other = group._sum.totalPrice?.toNumber() ?? 0;
      }
    });

    return { success: true, data: initalData };
  } catch (error) {
    console.error('Error fetching sale by category:', error);
    return { success: false, error: 'Failed to fetch sale by category' };
  }
};

export default getSaleByCategory;
