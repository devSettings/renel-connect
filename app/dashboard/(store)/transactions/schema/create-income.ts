import { TypeOfTransaction } from '@prisma/client';
import z from 'zod';

const createIncomeSchema = z.object({
  title: z
    .string({ required_error: 'Income needs to have a title' })
    .min(3, { message: 'Income title should be atleast 3 characters' })
    .max(255, { message: 'Income title  has axceed maximum length' }),
  description: z.string().optional(),
  amount: z
    .number({
      required_error: 'Income amount is a required field',
      invalid_type_error: 'Income amount should be a number',
    })
    .min(1, { message: 'Income amount should atleast 1' }),
  category: z.string({ required_error: 'Category is required' }),
  typeOfTransaction: z.nativeEnum(TypeOfTransaction, {
    errorMap: () => ({
      message: 'Please select on of the provided categories',
    }),
  }),
  IncomeDate: z.date({ required_error: 'Income Date is required' }),
});

export default createIncomeSchema;
