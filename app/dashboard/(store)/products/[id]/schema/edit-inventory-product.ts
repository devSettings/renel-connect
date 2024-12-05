import { ProductStatus } from '@prisma/client';
import { z } from 'zod';

export const editInventoryProductSchema = z.object({
  id: z.string({ required_error: 'Product is required' }),
  name: z
    .string({ required_error: 'Le nom du produit est requis' })
    .min(3, {
      message: 'Le nom du produit doit comporter au moins 3 caractères',
    })
    .max(50, {
      message: 'Le nom du produit ne peut pas comporter plus de 50 caractères',
    }),

  category: z
    .string({ required_error: 'La catégorie du produit est requise' })
    .min(8, { message: 'La catégorie doit comporter au moins 8 caractères' }),
  sellingPrice: z
    .number({
      required_error: 'Le prix de vente est requis',
      invalid_type_error: 'Selling price should should a positive number',
    })
    .positive('Le prix de vente doit être supérieur à 0'),

  status: z.nativeEnum(ProductStatus, {
    errorMap: () => ({
      message: `Le statut du produit doit être une des valeurs suivantes `,
    }),
  }),

  reorderLevel: z
    .number({
      required_error: 'Le seuil est requis',
      invalid_type_error: 'Reorder Leve should a positive number',
    })
    .positive('Le seuil doit être une valeur positive'),
});
