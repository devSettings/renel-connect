import { ProductStatus } from '@prisma/client';
import { z } from 'zod';

const productStatus = ['ACTIVE', 'ARCHIVED'] as const;

const editNonInventoryProductSchema = z.object({
  id: z.string({ required_error: 'Product is is required' }),
  name: z
    .string()
    .min(3, {
      message: 'Le nom du produit doit comporter au moins 3 caractères',
    })
    .max(50, {
      message: 'Le nom du produit ne peut pas comporter plus de 50 caractères',
    }),
  category: z.string({
    required_error: 'La catégorie du produit est requise',
  }),
  sellingPrice: z.number().positive('Le prix de vente doit être supérieur à 0'),
  status: z.nativeEnum(ProductStatus, {
    errorMap: () => ({
      message: `Le statut du produit doit être une des valeurs suivantes : ${productStatus.join(
        ', '
      )}`,
    }),
  }),
});

export default editNonInventoryProductSchema;
