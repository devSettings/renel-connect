'use server';

import prisma from '@/prisma/client';

type FilterOption = {
  search?: string;
  count?: number;
};

const getSimpleInventoryProducts = async (option: FilterOption = {}) => {
  const { search, count } = option;
  try {
    const products = await prisma.product.findMany({
      where: {
        type: 'INVENTORY',
        name: { contains: search },
      },
      select: { id: true, name: true },
      take: count,
    });
    return { success: true, data: products };
  } catch (error) {}
};
export default getSimpleInventoryProducts;
