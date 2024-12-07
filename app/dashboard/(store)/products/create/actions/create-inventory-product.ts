'use server';
import 'server-only';

import prisma from '@/prisma/client';
import { revalidatePath } from 'next/cache';
import createInventoryProductSchema from '../schema/create-inventory-product';
import { z } from 'zod';
import generateProductSku from './generate-product-sku';
import { currentUser } from '@clerk/nextjs/server';

type FormData = z.infer<typeof createInventoryProductSchema>;
const createInventoryProduct = async (data: FormData) => {
  const sku = await generateProductSku();
  const result = createInventoryProductSchema.safeParse(data);
  const user = await currentUser();
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (!result?.success) {
    return {
      success: false,
      error: result.error.flatten().fieldErrors,
    };
  }

  const productFound = await prisma.product.findUnique({
    where: { slug: result.data.name.toLowerCase().replace(/ /g, '-') },
  });

  if (productFound) {
    return { success: false, error: 'Product name already exist' };
  }

  try {
    const product = await prisma.product.create({
      data: {
        sku: result.data.sku || sku!,
        name: result.data.name,
        sellingPrice: result.data.sellingPrice,
        status: result.data.status,
        categoryId: result.data.category,
        type: 'INVENTORY',
        slug: result.data.name.toLowerCase().replace(/ /g, '-'),
        createdById: user.id,
        department: 'OTHER',
        InventoryProduct: {
          create: { reorderLevel: result.data.reorderLevel },
        },
      },
    });
    revalidatePath('/dashboard/products');
    return { success: true, data: product };
  } catch (error) {
    return { success: false, error: `${String(error)}` };
  }
};

export default createInventoryProduct;
