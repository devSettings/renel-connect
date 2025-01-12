'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { ItemReport } from '../types/report';

type FilterOption = {
  date: { start: string; end: string };
};

const getSaleItems = async (
  filterOption?: FilterOption
): Promise<ActionResponse<ItemReport[]>> => {
  if (!filterOption) {
    console.error('No filter option provided');
    return {
      success: false,
      error: 'No filter option provided. Please provide a valid date range.',
    };
  }

  const { date } = filterOption; // Destructure the date object from filterOption
  try {
    // Group sales data by product
    const items = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _avg: { unitPrice: true },
      _max: { createdAt: true },
      _count: { _all: true },
      where: {
        orderDate: date.start, // Use the start date from filterOption
      },
    });

    // Get all product details for the sold items
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        InventoryProduct: { select: { quantityInStock: true } },
      },
    });

    // Create a product map for quick lookups
    const productsMap = new Map(
      products.map((p) => [
        p.id,
        {
          name: p.name,
          quantityInStock:
            p.InventoryProduct.length > 0
              ? p.InventoryProduct[0].quantityInStock
              : 0,
        },
      ])
    );

    // Calculate total revenue for sales contribution
    const totalRevenue = items.reduce(
      (sum, item) =>
        sum + item._sum.quantity! * (Number(item._avg.unitPrice) || 0),
      0
    );

    // Build the report
    const report = items.map((item) => {
      const productDetails = productsMap.get(item.productId) || {
        name: 'Unknown',
        quantityInStock: 0,
      };

      const quantitySold = item._sum.quantity || 0;
      const averageSalePrice = Number(item._avg.unitPrice) || 0;
      const totalRevenueForProduct = quantitySold * averageSalePrice;
      const salesContribution =
        totalRevenue > 0 ? (totalRevenueForProduct / totalRevenue) * 100 : 0;

      return {
        id: item.productId,
        name: productDetails.name,
        quantitySold,
        totalSalesCount: item._count._all,
        averageSalePrice,
        totalRevenue: totalRevenueForProduct,
        lastPurchaseDate: item._max.createdAt?.toDateString() || 'N/A',
        salesContribution: parseFloat(salesContribution.toFixed(2)), // Corrected property name
        quantityInStock: productDetails.quantityInStock, // Corrected property name
      };
    });

    return { success: true, data: report };
  } catch (error) {
    console.error('Error fetching sales report:', error);
    return {
      success: false,
      error: 'Failed to fetch sales report. Please try again later.',
    };
  }
};

export default getSaleItems;
