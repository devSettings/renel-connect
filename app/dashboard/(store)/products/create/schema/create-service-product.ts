import { ProductStatus } from '@prisma/client';
import { z } from 'zod';

const createServiceProductSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Le nom du produit doit comporter au moins 3 caractères',
    })
    .max(50, {
      message: 'Le nom du produit ne peut pas comporter plus de 50 caractères',
    }),
  sku: z
    .string()
    .min(8, { message: 'Le SKU est requis' })
    .max(20, { message: 'Le SKU ne peut pas comporter plus de 10 caractères' })
    .optional(),
  category: z.string({
    required_error: 'La catégorie du produit est requise',
  }),
  sellingPrice: z.number().positive('Le prix de vente doit être supérieur à 0'),
  productType: z.literal('SERVICES', {
    message: 'Le type de produit doit être Services',
  }),
  status: z.nativeEnum(ProductStatus, {
    errorMap: () => ({
      message: `Le statut du produit doit être une des valeurs suivantes `,
    }),
  }),
  serviceDuration: z
    .number()
    .positive('La durée du service doit être supérieure à 0'),
  serviceLocation: z.string({
    required_error: 'Le lieu du service est requis',
  }),
});

export default createServiceProductSchema;
