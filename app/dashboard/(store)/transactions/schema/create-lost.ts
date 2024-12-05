import { TypeOfTransaction } from '@prisma/client';
import z from 'zod';

const createLostSchema = z.object({
  product: z
    .string({
      required_error: 'Product name is a required field.',
    })
    .min(1, { message: 'Please provide a product name.' }),
  quantityLost: z
    .number({
      required_error: 'Quantity bought is required.',
      invalid_type_error: 'Quantity bought should be a vallid number.',
    })
    .min(1, { message: 'Quantity bought should be greater or equal to 1.' }),

  lostDate: z.date({ required_error: 'Lost date a required' }),
  typeOfTransaction: z.nativeEnum(TypeOfTransaction, {
    errorMap: () => ({
      message: 'Please select one of the provided transaction type',
    }),
  }),
  description: z
    .string({
      required_error:
        'Give a breif description has the required the product should be considered lost.',
    })
    .min(10, {
      message: 'The description should as clear as possible and concise.',
    })
    .max(250, { message: 'The description you provided is too long' }),
});

export default createLostSchema;
