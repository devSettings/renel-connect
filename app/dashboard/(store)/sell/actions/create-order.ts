'use server';

import prisma from '@/prisma/client';
import { Collection, PaymentMethod } from '@prisma/client';
import SaleReference from './create-order-reference';
import { ActionResponse } from '@/app/types/action-reponse';
import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';

const CURRENT_YEAR = new Date().getFullYear();
const OrderDate = format(new Date(CURRENT_YEAR, 0, 1), 'yyyy-dd-MM');

export type SaleData = {
  cashier_id: string;
  category: Collection;
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

export type OrderData = {
  CashierId: string;
  category: Collection;
  paymentMethod: PaymentMethod;
  subTotal: number;
  amountReceived?: number;
  customerChange?: number;
  discount: number;
  total: number;
  tax?: number;
  transactionReceiptId?: string;
  customerId?: string;
};

export type OrderItemData = {
  productId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}[];

const createOrder = async (
  orderData: {},
  OrderItemData: []
): Promise<ActionResponse> => {
  try {
    if (!orderData || !OrderItemData || OrderItemData.length === 0) {
      return { success: false, error: 'Order Can not be created' };
    }

    const reference = await SaleReference();
    if (!reference)
      return { success: false, error: 'Failed to generate Order Refrence' };

    await prisma.order.create({
      data: {
        reference: reference,
        orderDate: OrderDate,
        cashierId: '',
        amountReceived: 0,
        source: 'POS',
        totalPrice: 0,
        totalItems: 0,
        category: 'OTHER',
        customerId: '',
        paymentMethod: 'CASH',
        change: 0,
        OrderItem: {
          create: [
            {
              unitPrice: 0,
              totalPrice: 0,
              quantity: 0,
              orderDate: OrderDate,
              productId: '',
              roomNumber: 0,
            },
          ],
        },
      },
    });

    revalidatePath('/dashboard/orders');
    revalidatePath('dashboard/reports');
    return { success: true, data: '' };
  } catch (error) {
    return { success: false, error: 'Failed to create Order' };
  }
};
