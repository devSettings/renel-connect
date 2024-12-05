import { TypeOfTransaction } from '@prisma/client';
import z from 'zod';

const createExpenseFormSchema = z.object({
  name: z
    .string({ required_error: 'Expense needs to have a title' })
    .min(3, { message: 'Expense title should be atleast 3 characters' })
    .max(50, { message: 'Expense title  has axceed maximum length' }),
  description: z.string().optional(),
  amount: z
    .number({
      required_error: 'Expense amount is a required field',
      invalid_type_error: 'Expense amount should be a number',
    })
    .min(1, { message: 'Expense amount should atleast 1' }),
  category: z.string({ required_error: 'Category is required' }),
  typeOfTransaction: z.nativeEnum(TypeOfTransaction, {
    errorMap: () => ({
      message: 'Please select on of the provided categories',
    }),
  }),
  expenseDate: z.date({
    required_error: 'Expense date is required',
    invalid_type_error: 'Expense date is invalid',
  }),
});

export default createExpenseFormSchema;
