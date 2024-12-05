'use server';

import prisma from '@/prisma/client';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import createExpenseFormSchema from '../schema/create-expense';

type FormData = z.infer<typeof createExpenseFormSchema>;

const createExpense = async (data: FormData) => {
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
        userId: '1',
      },
    });
    revalidatePath('/dashboard/transactions');
    return { success: true, data: expense };
  } catch (error) {
    return {
      success: false,
      message: `Failed to create expense: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: [],
    };
  }
};

export default createExpense;
