import { ProductStatus } from '@prisma/client';
import { z } from 'zod';

export const editInventoryProductSchema = z.object({
  id: z.string({ required_error: 'Product is required' }),
  name: z
    .string({ required_error: 'The product name is required' })
    .min(3, {
      message: 'The product name must be at least 3 characters',
    })
    .max(50, {
      message: 'The product name must not exceed 50 characters',
    }),

  category: z
    .string({ required_error: 'The product category is required' })
    .min(8, { message: 'The category must be at least 8 characters' }),
  sellingPrice: z
    .number({
      required_error: 'The selling price is required',
      invalid_type_error: 'Selling price should should a positive number',
    })
    .positive('The selling price must be greater than 0'),

  status: z.nativeEnum(ProductStatus, {
    errorMap: () => ({
      message: `The product status must be one of the following values: ${Object.values(
        ProductStatus
      ).join(', ')}`,
    }),
  }),

  reorderLevel: z
    .number({
      required_error: 'The reorder level is required',
      invalid_type_error: 'Reorder Level should a positive number',
    })
    .positive('The reorder level must be a positive number'),
});
