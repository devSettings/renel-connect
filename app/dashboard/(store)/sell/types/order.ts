import { Collection, PaymentMethod } from '@prisma/client';

export type OrderData = {
  category: Collection;
  paymentMethod: PaymentMethod;
  subTotal: number;
  amountReceived: number;
  customerChange?: number;
  discount: number;
  total: number;
  tax?: number;
  transactionReceiptId?: string;
  customerId?: string;
  roomNumber?: number;
};

export type OrderItemData = {
  productId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}[];
