'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { format } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { OrderData, OrderItemData } from '../types/order';
import SaleReference from './create-order-reference';

const OrderDate = format(new Date(), 'yyyy-MM-dd');

const createOrder = async (
  orderData: OrderData,
  OrderItemData: OrderItemData
): Promise<ActionResponse> => {
  try {
    if (!orderData || !OrderItemData || OrderItemData.length === 0) {
      console.error('Invalid input data');
      return {
        success: false,
        error: 'Order cannot be created: Invalid input data',
      };
    }

    const reference = await SaleReference();
    if (!reference) {
      console.error('Failed to generate Order Reference');
      return { success: false, error: 'Failed to generate Order Reference' };
    }

    const orderItems = OrderItemData.map((item) => ({
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      quantity: item.quantity,
      orderDate: OrderDate,
      productId: item.productId,
    }));

    const result = await prisma.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          reference: reference,
          orderDate: OrderDate,
          cashierId: 'cm4ctbui5000449i07gvj0k9y',
          amountReceived: orderData.amountReceived,
          source: 'POS',
          totalPrice: orderData.total,
          totalItems: OrderItemData.length,
          category: orderData.category,
          customerId: orderData.customerId ?? 'cm4d2q3qp000149im2cyb69sq',
          paymentMethod: orderData.paymentMethod,
          change: orderData.customerChange,
          OrderItem: {
            create: orderItems,
          },
        },
      });

      for (const item of OrderItemData) {
        const inventoryProduct = await prisma.inventoryProduct.findUnique({
          where: { productId: item.productId },
        });

        if (inventoryProduct) {
          await prisma.inventoryProduct.update({
            where: { productId: item.productId },
            data: {
              quantityInStock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return order;
    });

    console.log('Prisma transaction result:', JSON.stringify(result, null, 2));

    revalidatePath('/dashboard/orders');
    revalidatePath('/dashboard/reports');

    return { success: true, data: 'Order created Successfully' };
  } catch (error) {
    console.error('Error in createOrder:', error);
    return {
      success: false,
      error: `Failed to create Order: ${
        error instanceof Error ? error.message : 'Unknown Error'
      }`,
    };
  }
};

export default createOrder;
