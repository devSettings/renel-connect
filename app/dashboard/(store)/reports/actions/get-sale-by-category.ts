'use server';
import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';

type FilterOption = {
  date: { start: string; end: string };
};

const getSaleByCategory = async (
  option: FilterOption
): Promise<ActionResponse> => {
  try {
    const initialData = {
      room: 0,
      drink: 0,
      food: 0,
      other: 0,
    };

    const aggregations = await prisma.order.groupBy({
      by: ['category'],
      _sum: { totalPrice: true },
      where: {
        orderDate: {
          gte: option.date.start,
          lte: option.date.end,
        },
      },
    });

    if (aggregations.length === 0) {
      return { success: true, data: initialData };
    }

    aggregations.forEach((group) => {
      if (group.category === 'ROOM') {
        initialData.room = group._sum.totalPrice?.toNumber() ?? 0;
      } else if (group.category === 'DRINK') {
        initialData.drink = group._sum.totalPrice?.toNumber() ?? 0;
      } else if (group.category === 'FOOD') {
        initialData.food = group._sum.totalPrice?.toNumber() ?? 0;
      } else {
        initialData.other = group._sum.totalPrice?.toNumber() ?? 0;
      }
    });

    return { success: true, data: initialData };
  } catch (error) {
    console.error('Error fetching sale by category:', error);
    return { success: false, error: 'Failed to fetch sale by category' };
  }
};

export default getSaleByCategory;
