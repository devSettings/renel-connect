'use server';

import prisma from '@/prisma/client';

import { ActionResponse } from '@/app/types/action-reponse';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import createProductCategorySchema from '../schema/create-product-category';

type FormData = z.infer<typeof createProductCategorySchema>;
const createProductCategory = async (
  data: FormData
): Promise<ActionResponse> => {
  const result = createProductCategorySchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  try {
    const uniqueCategory = await prisma.category.findFirst({
      where: { slug: data.title.toLowerCase().replace(/ /g, '-') },
    });

    if (uniqueCategory) {
      return {
        success: false,
        error: 'Category already exists',
      };
    }

    const newCategory = await prisma.category.create({
      data: {
        name: data.title,
        slug: data.title.toLowerCase().replace(/ /g, '-'),
      },
    });

    revalidatePath('/dashboard/products');
    return {
      success: true,
      data: newCategory,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: `Unable to create category - ${String(error)}`,
    };
  }
};

export default createProductCategory;
