import { ProductStatus } from '@prisma/client';
import { z } from 'zod';

const createServiceProductSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'The product name must be at least 3 characters',
    })
    .max(50, {
      message: 'The product name must not exceed 50 characters',
    }),
  sku: z
    .string()
    .min(8, { message: 'The SKU is required' })
    .max(20, { message: 'The SKU must not exceed 10 characters' })
    .optional(),
  category: z.string({
    required_error: 'The product category is required',
  }),
  sellingPrice: z.number().positive('The selling price must be greater than 0'),
  productType: z.literal('SERVICES', {
    message: 'The product type must be Services',
  }),
  status: z.nativeEnum(ProductStatus, {
    errorMap: () => ({
      message: `The product status must be one of the following values: ${Object.values(
        ProductStatus
      ).join(', ')}`,
    }),
  }),
  serviceDuration: z
    .number()
    .positive('The service duration must be greater than 0'),
  serviceLocation: z.string({
    required_error: 'The service location is required',
  }),
});

export default createServiceProductSchema;
