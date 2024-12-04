'use server';

import prisma from '@/prisma/client';

const getProductById = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        InventoryProduct: {
          select: { quantityInStock: true, averageUnitCostPrice: true },
        },
        sellingPrice: true,
      },
    });

    if (!product) {
      return { success: false, error: 'Product Not Found' };
    }
    return { success: true, data: product.id };
  } catch (error) {}
};
export default getProductById;
