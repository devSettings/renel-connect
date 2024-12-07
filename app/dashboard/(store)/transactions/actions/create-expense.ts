'use server';

import prisma from '@/prisma/client';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import createExpenseFormSchema from '../schema/create-expense';
import { currentUser } from '@clerk/nextjs/server';
import { ActionResponse } from '@/app/types/action-reponse';

type FormData = z.infer<typeof createExpenseFormSchema>;

const createExpense = async (data: FormData): Promise<ActionResponse> => {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  const result = createExpenseFormSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.flatten().fieldErrors };
  }

  try {
    const expense = await prisma.expense.create({
      data: {
        title: result.data.name,
        description: result.data.description,
        amount: result.data.amount,
        typeOfTransaction: result.data.typeOfTransaction,
        expenseDate: result.data.expenseDate.toISOString().split('T')[0],
        expenseCategoryId: result.data.category,
        userId: user.id,
      },
    });
    revalidatePath('/dashboard/transactions');
    return { success: true, data: expense };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export default createExpense;
