import { z } from 'zod';

const PaymentMethodEnum = z.enum(['CASH', 'CREDIT_CARD', 'CHECK'], {
  errorMap: () => ({
    message:
      "le mode de paiement doit être l'une des valeurs suivantes (espèces, chèque, carte de crédit)",
  }),
});
const TransactionTypeEnum = z.enum(['ROOM', 'DRINK', 'FOOD'], {
  errorMap: () => ({
    message: 'le type de transaction ne peut être que Chambre ou Bar',
  }),
});

const checkOutSchema = z
  .object({
    paymentMethod: PaymentMethodEnum,
    transactionType: TransactionTypeEnum,
    amountReceived: z.number().optional(),
    transactionId: z.string().optional(),
    customerId: z.string().optional(),
    roomNumber: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === 'CASH' && data.amountReceived === undefined) {
        return false;
      }
      if (data.paymentMethod !== 'CASH' && !data.transactionId) {
        return false;
      }
      if (
        data.transactionType === 'ROOM' &&
        (!data.customerId || !data.roomNumber)
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Both discount type and value are required if one is provided',
      path: [
        'paymentMethod',
        'transactionType',
        'amountReceived',
        'transactionId',
        'customerId',
        'roomNumber',
      ],
    }
  );

export type CheckoutFormData = z.infer<typeof checkOutSchema>;

export default checkOutSchema;
