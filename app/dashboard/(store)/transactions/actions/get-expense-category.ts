'use server';

import prisma from '@/prisma/client';

interface GetCategoryOptions {
  search?: string;
  page?: number;
  pageSize?: number;
}

const getExpenseCategory = async ({
  search = '',
  page = 1,
  pageSize = 10,
}: GetCategoryOptions = {}) => {
  const skip = (page - 1) * pageSize;

  try {
    const categories = await prisma.expenseCategory.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search } },
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
      message: `Unable to fetch categories - ${String(error)}`,
    };
  }
};

export default getExpenseCategory;
