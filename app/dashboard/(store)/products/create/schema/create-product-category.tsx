import { z } from 'zod';

const createProductCategorySchema = z.object({
  title: z
    .string({ required_error: 'The category title is required' })
    .min(3, { message: 'Provide a valid category title' })
    .max(50, { message: 'Category title is not valid' }),
});

export default createProductCategorySchema;
