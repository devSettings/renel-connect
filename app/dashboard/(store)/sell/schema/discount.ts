import { z } from 'zod';

export const discountSchema = z.object({
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().nonnegative(),
  confirmationCode: z.string().min(4),
});
