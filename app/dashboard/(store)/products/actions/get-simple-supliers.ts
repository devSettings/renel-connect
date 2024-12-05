'use server';

import prisma from '@/prisma/client';

const getSimpleSuppliers = async () => {
  try {
    const suppliers = await prisma.supplier.findMany({
      select: { id: true, name: true },
    });
    return { success: true, data: suppliers, error: null };
  } catch (error) {
    return { success: false, error: 'Faild to ', data: [] };
  }
};

export default getSimpleSuppliers;
