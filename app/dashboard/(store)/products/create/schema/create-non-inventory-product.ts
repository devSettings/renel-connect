import { z } from 'zod';

const productStatus = ['ACTIVE', 'DRAFT'] as const;

const createNonInventoryProductSchema = z.object({
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
  productType: z.literal('NON_INVENTORY', {
    message: 'Le type de produit doit être Non-Inventaire',
  }),
  status: z.enum(productStatus, {
    errorMap: () => ({
      message: `Le statut du produit doit être une des valeurs suivantes : ${productStatus.join(
        ', '
      )}`,
    }),
  }),
});

export default createNonInventoryProductSchema;
