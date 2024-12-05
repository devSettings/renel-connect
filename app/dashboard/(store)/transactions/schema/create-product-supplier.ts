import { z } from 'zod';

export const createProductSupplierFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Supplier name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().min(8, {
    message: 'Phone number must be at least 8 digits.',
  }),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  products: z.string().min(3, {
    message: 'Veuillez saisir au moins un produit.',
  }),
});

export type CreateProductSupplierFormData = z.infer<
  typeof createProductSupplierFormSchema
>;
