'use server';

import SaleReference from '@/lib/create-sales-reference';
import prisma from '@/prisma/client';
import { PaymentMethod, Prisma, SaleCategory } from '@prisma/client';

export type SaleData = {
  cashier_id: string;
  category: SaleCategory;
  paymentMethod: PaymentMethod;
  sub_total: number;
  amount_received?: number;
  customer_change?: number;
  discount: number;
  total: number;
  tax?: number;
  room_number?: string;
  transaction_receipt_id?: string;
  customer_id?: string;
};

export type SaleItemsData = {
  product_id: string;
  unit_price: number;
  quantity: number;
  selling_price: number;
  total_price: number;
};

const createSale = async (
  saleData: SaleData,
  saleItemsData: SaleItemsData[]
) => {
  try {
    if (!saleData || !saleItemsData || saleItemsData.length === 0) {
      throw new Error(
        `Données de vente ou données d'articles soldés non valides`
      );
    }
    // Generate unique sale reference
    const reference = await SaleReference();
    if (!reference) {
      throw new Error('Failed to generate a sale reference.');
    }

    // Create the sale entry in the database

    // Start a transaction for creating sale and saleItems
    const result = await prisma.$transaction(async (prisma) => {
      const newSale = await prisma.sale.create({
        data: {
          reference,
          cashier_id: saleData.cashier_id,
          category: saleData.category,
          payment_method: saleData.paymentMethod,
          sub_total: saleData.sub_total,
          amount_received: saleData.amount_received || 0,
          customer_change: saleData.customer_change,
          discount: saleData.discount || 0,
          total: saleData.total,
          tax: saleData.tax,
          room_number: saleData.room_number,
          transaction_receipt_id: saleData.transaction_receipt_id,
          customer_id: saleData.customer_id,
        },
      });

      await prisma.saleItem.createMany({
        data: saleItemsData.map((item) => ({
          sale_id: newSale.id,
          product_id: item.product_id,
          unit_price: item.unit_price,
          selling_price: item.selling_price,
          total_price: item.total_price,
          quantity: item.quantity,
        })),
      });

      // Fetch sale items with related product information
      const saleItems = await prisma.saleItem.findMany({
        where: { sale_id: newSale.id },
        include: { product: { select: { name: true } } },
      });

      return {
        newSale,
        saleItems,
      };
    });

    return {
      success: true,
      saleData: result.newSale,
      saleItemData: result.saleItems,
      message: 'Vente créée avec succès.',
    };
  } catch (error) {
    console.error('Error creating sale:', error);

    // Differentiate error types for better feedback
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      if (error.code === 'P2002') {
        return {
          success: false,
          message:
            'Unique constraint violation. A sale with this reference already exists.',
        };
      }
      return {
        success: false,
        message:
          'Database error. Please contact support if the issue persists.',
      };
    } else if (error instanceof Error) {
      // Handle general errors
      return { success: false, message: error.message };
    } else {
      // Handle unexpected errors
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      };
    }
  }
};

export default createSale;
