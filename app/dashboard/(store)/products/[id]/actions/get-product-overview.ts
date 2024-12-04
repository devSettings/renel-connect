'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';

interface ProductOverview {
  sellingPrice: number;
  costPrice: number;
  unitGrossProfit: number;
  profitMargin: number;
  stockValue: number;
  salesContribution: number;
  averageTransactionValue: number;
  stockTurnOver: number;
}

const roundToTwoDecimals = (num: number): number => Number(num.toFixed(2));

const getProductOverview = async (
  id: string
): Promise<ActionResponse<ProductOverview>> => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        InventoryProduct: {
          select: { quantityInStock: true },
        },
      },
    });

    if (!product) {
      return { success: false, error: 'Product Not Found' };
    }

    const inventory = product.InventoryProduct?.[0];
    const quantityInStock = inventory?.quantityInStock ?? 0;

    const [productAggregates, totalRevenue] = await Promise.all([
      prisma.orderItem.aggregate({
        where: { productId: id },
        _sum: { totalPrice: true },
        _avg: { totalPrice: true, unitPrice: true },
      }),
      prisma.orderItem.aggregate({
        _sum: { totalPrice: true },
      }),
    ]);

    const aquisitions = await prisma.aquisition.aggregate({
      where: { productId: id },
      _avg: { averageUnitCostPrice: true },
      _count: { id: true },
    });

    const stockTurnOver = aquisitions._count.id;

    const totalRevenueForProduct =
      productAggregates._sum.totalPrice?.toNumber() ?? 0;
    const averageTransactionValue =
      productAggregates._avg.totalPrice?.toNumber() ?? 0;
    const totalRevenueAllProducts =
      totalRevenue._sum.totalPrice?.toNumber() ?? 0;

    const averageCostPrice =
      aquisitions._avg.averageUnitCostPrice?.toNumber() ?? 0;

    const averageSellingPrice =
      productAggregates._avg.unitPrice?.toNumber() ?? 0;

    const averageUnitGrossProfit =
      averageSellingPrice > 0
        ? averageSellingPrice - averageCostPrice
        : averageSellingPrice;

    const stockValue =
      quantityInStock > 0
        ? quantityInStock * averageCostPrice
        : averageSellingPrice;

    const profitMargin =
      averageSellingPrice > 0
        ? (averageUnitGrossProfit / averageSellingPrice) * 100
        : 0;

    const salesContribution =
      totalRevenueAllProducts > 0
        ? (totalRevenueForProduct / totalRevenueAllProducts) * 100
        : 0;

    const overview: ProductOverview = {
      sellingPrice: averageSellingPrice,
      costPrice: averageCostPrice,
      unitGrossProfit: averageUnitGrossProfit,
      profitMargin: roundToTwoDecimals(profitMargin),
      stockValue,
      salesContribution: roundToTwoDecimals(salesContribution),
      averageTransactionValue: roundToTwoDecimals(averageTransactionValue),
      stockTurnOver: stockTurnOver,
    };

    return { success: true, data: overview };
  } catch (error) {
    console.error('Error fetching product metrics:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Unexpected error occurred',
    };
  }
};

export default getProductOverview;
