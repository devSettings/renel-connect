'use server';

import prisma from '@/prisma/client';
import { revalidatePath } from 'next/cache';
import { currentUser } from '@clerk/nextjs/server';
import { ActionResponse } from '@/app/types/action-reponse';
import { IncomeCategory } from '@prisma/client';
import { z } from 'zod';
import createIncomeSchema from '../schema/create-income';
type FormData = z.infer<typeof createIncomeSchema>;
const createIncome = async (data: FormData): Promise<ActionResponse> => {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: 'User not found' };
  }
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
        userId: user.id,
        category: result.data.category as IncomeCategory,
      },
    });
    revalidatePath('/dashboard/transactions');
    return { success: true, data: income };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export default createIncome;
