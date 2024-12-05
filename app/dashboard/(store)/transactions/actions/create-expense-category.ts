'use server';

import prisma from '@/prisma/client';

import { ActionResponse } from '@/app/types/action-reponse';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createExpenseCategorySchema } from '../schema/create-expense-category';

type FormData = z.infer<typeof createExpenseCategorySchema>;

const createExpenseCategory = async (
  data: FormData
): Promise<ActionResponse> => {
  const result = createExpenseCategorySchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  try {
    const uniqueCategory = await prisma.expenseCategory.findFirst({
      where: { slug: data.title.toLowerCase().replace(/ /g, '-') },
    });

    if (uniqueCategory) {
      return {
        success: false,
        error: 'Category already exists',
      };
    }

    const newCategory = await prisma.expenseCategory.create({
      data: {
        title: data.title,
        slug: data.title.toLowerCase().replace(/ /g, '-'),
      },
    });

    revalidatePath('/products/new');
    return {
      success: true,
      data: 'Category created',
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: `Unable to create category - ${String(error)}`,
    };
  }
};

export default createExpenseCategory;
