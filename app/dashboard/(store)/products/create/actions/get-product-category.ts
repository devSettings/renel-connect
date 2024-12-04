'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
export type Category = {
  id: string;
  name: string;
  slug: string;
};

interface GetCategoryOptions {
  search?: string;
  page?: number;
  pageSize?: number;
}

const getCategories = async ({
  search = '',
  page = 1,
  pageSize = 10,
}: GetCategoryOptions = {}): Promise<ActionResponse> => {
  const skip = (page - 1) * pageSize;

  try {
    const categories: Category[] = await prisma.category.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { slug: { contains: search } },
            ],
          }
        : undefined,
      skip,
      take: pageSize,
    });

    return { success: true, data: categories };
  } catch (error: unknown) {
    return {
      success: false,
      error: `Unable to fetch categories - ${String(error)}`,
    };
  }
};

export default getCategories;
