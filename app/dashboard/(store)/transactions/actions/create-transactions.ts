'use server';

import { z } from 'zod';

import prisma from '@/prisma/client';
import { format } from 'date-fns';
import { revalidatePath } from 'next/cache';
import createAquisitionSchema from '../schema/create-aquisition';

const CURRENT_YEAR = new Date().getFullYear();
const START_DATE = format(new Date(CURRENT_YEAR, 0, 1), 'yyyy-dd-MM');

const calculateAverageUnitCost = (costs: number[]): number =>
  parseFloat(
    (costs.reduce((sum, cost) => sum + cost, 0) / costs.length).toFixed(2)
  );

type FormData = z.infer<typeof createAquisitionSchema>;
const createAquisition = async (data: FormData) => {
  const result = createAquisitionSchema.safeParse(data);

  if (!result.success)
    return { success: false, error: result.error.flatten().fieldErrors };

  try {
    const product = await prisma.inventoryProduct.findUnique({
      where: { productId: result.data.product },
      select: {
        productId: true,
        quantityInStock: true,
        averageUnitCostPrice: true,
      },
    });

    const supplier = await prisma.supplier.findUnique({
      where: { id: result.data.supplier },
    });

    if (!supplier) return { success: false, error: 'Supplier Not Found.' };

    if (!product) return { success: false, error: 'Product Not Found.' };

    // Get all acquisitions for this year to calculate new average cost
    const allAquisitions = await prisma.aquisition.findMany({
      where: {
        productId: product.productId,
        aquisitionDate: { gte: START_DATE },
      },
      select: {
        quantityBought: true,
        averageUnitCostPrice: true,
      },
    });

    // Include the new acquisition in the calculation
    const allAverageUnitCosts = [
      ...allAquisitions.map((acq) => Number(acq.averageUnitCostPrice)),
      Number(result.data.avarageUnitCostPrice),
    ];

    const newAverageCost = calculateAverageUnitCost(allAverageUnitCosts);

    const newQuantity = product.quantityInStock + result.data.quantityBought;

    const [_aquisitions, p] = await prisma.$transaction([
      prisma.aquisition.create({
        data: {
          productId: product.productId,
          aquisitionDate: result.data.acquisitionDate
            .toISOString()
            .split('T')[0],
          userId: 'cm4ct968q000049i0xxqmz5e4',
          supplierId: result.data.supplier,
          typeOfTransaction: 'AQUISITION',
          quantityBought: result.data.quantityBought,
          averageUnitCostPrice: result.data.avarageUnitCostPrice,
          expiredDate: result.data.expiryDate!.toISOString().split('T')[0],
          totalCost:
            result.data.avarageUnitCostPrice * result.data.quantityBought,
        },
      }),
      prisma.inventoryProduct.update({
        where: { productId: product.productId },
        data: {
          quantityInStock: newQuantity,
          averageUnitCostPrice: newAverageCost,
          lastPurchaseDate: result.data.acquisitionDate
            .toISOString()
            .split('T')[0],
        },
      }),
    ]);

    revalidatePath('/dashboard/transactions');
    return { success: true, data: _aquisitions };
  } catch (error) {
    console.error('Failed to create acquisition:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while processing your request.',
    };
  }
};

export default createAquisition;
