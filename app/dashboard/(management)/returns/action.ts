'use server';

import prisma from '@/prisma/client';
import { currentUser } from '@clerk/nextjs/server';
import { format } from 'date-fns';
import { ReturnTable } from './returns-table';
import { returnFormData, returnschema } from './schema';
import { revalidatePath } from 'next/cache';

const RefundDate = format(
  new Date(new Date().setHours(new Date().getHours() - 6)),
  'yyyy-MM-dd'
);

const requestReturn = async (
  data: returnFormData
): Promise<{ success: boolean; error?: string; message?: string }> => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const isCorrect = returnschema.safeParse(data);

    if (!isCorrect) {
      return { success: false, error: 'Return can not be processed' };
    }

    const getrequest = await prisma.return.findFirst({
      where: { reference: isCorrect.data?.reference },
      select: { status: true },
    });

    if (getrequest?.status === 'PENDING')
      return {
        success: false,
        error: 'this order already has an pending request',
      };

    const order = await prisma.order.findUnique({
      where: { reference: isCorrect.data?.reference },
    });
    if (!order) return { success: false, error: 'Order cannot be found' };

    const items = await prisma.orderItem.findMany({
      where: { order },
      select: {
        id: true,
        orderId: true,
        productId: true,
        quantity: true,
        unitPrice: true,
        totalPrice: true,
        orderDate: true,
      },
    });

    const returnItems = items.map((item) => ({
      returnId: isCorrect.data?.reference!,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      returnDate: RefundDate,
    }));

    const result = await prisma.$transaction(async (prisma) => {
      await prisma.return.create({
        data: {
          reference: isCorrect.data?.reference!,
          reason: isCorrect.data?.reason!,
          returnDate: RefundDate,
          totalItems: order.totalItems,
        },
      });

      const items = await prisma.returnItem.createMany({
        data: returnItems,
      });

      console.log(items);

      return { success: true, message: 'Return has been requested' };
    });

    return result;
  } catch (error) {
    return { success: false, error: 'Internal Server' };
  }
};

export default requestReturn;

export const getRefundRequest = async (): Promise<ReturnTable[]> => {
  try {
    const returns = await prisma.return.findMany({
      select: {
        id: true,
        reference: true,
        totalItems: true,
        reason: true,
        status: true,
        returnDate: true,
        moderator: true,
      },
      where: { status: 'PENDING' },
    });

    const formattedReturns = returns.map((item) => ({
      id: item.id,
      orderId: item.reference,
      items: item.totalItems,
      reason: item.reason,
      Status: item.status,
      date: item.returnDate,
      moderator: item.moderator?.firstName
        ? `${item.moderator?.firstName} ${item.moderator?.lastName}`
        : '-',
    }));

    return formattedReturns;
  } catch (error) {
    return [];
  }
};

export const returnMetrics = async () => {
  try {
    const totalReturnRequest = await prisma.return.count();
    const returnStatus = await prisma.return.groupBy({
      by: ['status'],
      _count: true,
    });

    const pendingReturns = returnStatus.find(
      (status) => status.status === 'PENDING'
    )?._count;
    const approvedReturns = returnStatus.find(
      (status) => status.status === 'APPROVED'
    )?._count;
    const rejectedReturns = returnStatus.find(
      (status) => status.status === 'REJECTED'
    )?._count;

    return {
      totalReturnRequest,
      pendingReturns,
      approvedReturns,
      rejectedReturns,
    };
  } catch (error) {
    console.error('Error fetching return metrics:', error);
    return {};
  }
};
export const Approved = async (reference: string) => {
  try {
    const returnRequest = await prisma.return.findFirst({
      where: {
        status: 'PENDING',
        reference: reference,
      },
    });

    if (!returnRequest) {
      console.error('Return request not found for reference:', reference);
      return;
    }

    await prisma.$transaction(async (prisma) => {
      const orderExists = await prisma.order.findUnique({
        where: { reference },
      });

      if (!orderExists) {
        console.error('Order not found for reference:', reference);
        return;
      }

      // await prisma.order.delete({
      //   where: { reference: orderExists.reference },
      //   include: { OrderItem: true },
      // });

      await prisma.return.update({
        where: { id: returnRequest.id },
        data: { status: 'APPROVED' },
      });

      revalidatePath('/dashboard/returns');
    });
  } catch (error) {
    console.error('Error handling approval:', error);
  }
};

export const Reject = async (reference: string) => {
  try {
    await prisma.return.update({
      where: { reference },
      data: { status: 'REJECTED' },
    });
    revalidatePath('/dashboard/returns');
  } catch (error) {
    console.error('Error handling approval:', error);
  }
};

// const returnItems = await prisma.returnItem.findMany({
//   where: { returnId: returnRequest.id },
// });

// for (const item of returnItems) {
//   const inventoryProduct = await prisma.inventoryProduct.findUnique({
//     where: { productId: item.productId },
//   });

//   if (inventoryProduct) {
//     await prisma.inventoryProduct.update({
//       where: { productId: item.productId },
//       data: {
//         quantityInStock: {
//           increment: item.quantity,
//         },
//       },
//     });
//   }
// }
