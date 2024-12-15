'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { format } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { OrderData, OrderItemData } from '../types/order';
import SaleReference from './create-order-reference';
import { currentUser } from '@clerk/nextjs/server';

const OrderDate = format(
  new Date(new Date().setHours(new Date().getHours() - 6)),
  'yyyy-MM-dd'
);

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
    const user = await currentUser();
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const customer = orderData.customerId ?? 'cm4hcl76y000149nrmevwrofu';

    const total = orderData.total;

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
          cashierId: user.id,
          amountReceived: orderData.amountReceived,
          source: 'POS',
          totalPrice: total,
          totalItems: OrderItemData.length,
          category: orderData.category,
          customerId: customer,
          paymentMethod: orderData.paymentMethod,
          change: orderData.customerChange,
          OrderItem: {
            create: orderItems,
          },
        },
      });

      const cashier = await prisma.user.findUnique({
        where: { id: order.cashierId },
      });

      const _items = await prisma.orderItem.findMany({
        where: { orderId: order.id },
        select: {
          product: {
            select: {
              name: true,
            },
          },
          unitPrice: true,
          quantity: true,
          totalPrice: true,
        },
      });

      const items = _items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.unitPrice,
        total: item.totalPrice,
      }));

      const newOrder = {
        transactionId: order.reference,
        cashier: cashier?.firstName + ' ' + cashier?.lastName,
        paymentMethod: order.paymentMethod,
        amountReceived: order.amountReceived,
        change: order.change,
        total: order.totalPrice,
        items: items,
        subtotal: order.totalPrice,
      };

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

      await prisma.customer.update({
        where: { id: customer },
        data: {
          totalOrders: { increment: 1 },
          totalSpend: { increment: total },
          lastPurchaseDate: OrderDate,
          loyaltyPoints: { increment: 10 },
        },
      });

      return newOrder;
    });

    console.log('Prisma transaction result:', JSON.stringify(result, null, 2));

    revalidatePath('/dashboard/orders');
    revalidatePath('/dashboard/reports');

    return { success: true, data: result };
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
