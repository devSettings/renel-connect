import { TypeOfTransaction } from '@prisma/client';
import z from 'zod';

const createAquisitionSchema = z.object({
  product: z
    .string({
      required_error: 'Product name is a required field.',
    })
    .min(1, { message: 'Please provide a product name.' }),
  quantityBought: z
    .number({
      required_error: 'Quantity bought is required.',
      invalid_type_error: 'Quantity bought should be a vallid number.',
    })
    .min(1, { message: 'Quantity bought should be greater or equal to 1.' }),
  avarageUnitCostPrice: z
    .number({
      required_error: 'Average unit cost price is a required field.',
      invalid_type_error: 'Average unit cost price should be a valid number.',
    })
    .min(1, {
      message: 'Average unit cost price should be greater or equal to 1.',
    }),
  supplier: z.string({
    required_error: 'Please select one of the provided suppliers',
  }),
  acquisitionDate: z.date({ required_error: 'Aquisition Date is required' }),
  typeOfTransaction: z.nativeEnum(TypeOfTransaction, {
    errorMap: () => ({
      message: 'Please select one of the provided transaction type',
    }),
  }),
  expiryDate: z.date(),
});

export default createAquisitionSchema;
