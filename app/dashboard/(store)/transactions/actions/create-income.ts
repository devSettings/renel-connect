'use server';

import prisma from '@/prisma/client';
import { revalidatePath } from 'next/cache';

import { IncomeCategory } from '@prisma/client';
import { z } from 'zod';
import createIncomeSchema from '../schema/create-income';
type FormData = z.infer<typeof createIncomeSchema>;
const createIncome = async (data: FormData) => {
  const result = createIncomeSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.flatten().fieldErrors };
  }

  try {
    const income = await prisma.income.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        amount: result.data.amount,
        typeOfTransaction: result.data.typeOfTransaction,
        incomeDate: result.data.IncomeDate.toISOString().split('T')[0],
        userId: '1',
        category: result.data.category as IncomeCategory,
      },
    });
    revalidatePath('/dashboard/transactions');
    return { success: true, data: income };
  } catch (error) {
    return {
      success: false,
      message: `Failed to create income: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    };
  }
};

export default createIncome;
