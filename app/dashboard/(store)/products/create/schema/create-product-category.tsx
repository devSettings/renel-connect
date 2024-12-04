import { z } from 'zod';

const createProductCategorySchema = z.object({
  title: z
    .string({ required_error: 'Le nom de la catégorie est obligatoire' })
    .min(3, { message: 'Fournir un nom de catégorie valide' })
    .max(50, { message: 'Nom de catégorie non valide' }),
});

export default createProductCategorySchema;
