import { z } from 'zod';

export const returnschema = z.object({
  reason: z.string({ required_error: 'return reason must be specified' }),
  reference: z.string({ required_error: ' order id is required' }),
});

export type returnFormData = z.infer<typeof returnschema>;
