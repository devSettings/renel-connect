'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { CustomerGenderMetrics } from '../types/customers';

const getCustomerGenderMetrics = async (): Promise<
  ActionResponse<CustomerGenderMetrics>
> => {
  try {
    // Group by `gender` for customers
    const aggregations = await prisma.user.groupBy({
      by: ['gender'],
      _count: { id: true },
      where: { Role: 'CUSTOMER' },
    });

    // Initialize metrics
    const genderMetrics = {
      male: 0,
      female: 0,
      other: 0,
    };

    // Populate metrics from aggregations
    aggregations.forEach((group) => {
      if (group.gender === 'MALE') {
        genderMetrics.male = group._count.id;
      } else if (group.gender === 'FEMALE') {
        genderMetrics.female = group._count.id;
      } else {
        genderMetrics.other = group._count.id;
      }
    });

    return { success: true, data: genderMetrics };
  } catch (error) {
    console.error('Error fetching customer gender metrics:', error);
    return { success: false, error: 'Failed to fetch customer gender metrics' };
  }
};

export default getCustomerGenderMetrics;
