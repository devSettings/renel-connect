'use server';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { ProductStatus, ProductType } from '@prisma/client';

export type ServiceProduct = {
  id: string;
  name: string;
  type: ProductType;
  sellingPrice: number;
  status: ProductStatus;
  category: string;
  serviceLocation: string;
  serviceDuration: number | undefined;
};

const getServiceProductById = async (
  id: string
): Promise<ActionResponse<ServiceProduct>> => {
  try {
    const rawProduct = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        type: true,
        name: true,
        status: true,
        category: true,
        ServicesProduct: {
          select: {
            serviceDuration: true,
            serviceLocation: true,
          },
        },
        sellingPrice: true,
      },
    });

    if (!rawProduct) {
      return { success: false, error: 'Product Not Found' };
    }

    const product = {
      id: rawProduct.id,
      name: rawProduct.name,
      sellingPrice: rawProduct.sellingPrice,
      type: rawProduct.type,
      status: rawProduct.status,
      category: rawProduct.category.id,
      serviceLocation: rawProduct.ServicesProduct?.serviceLocation || '',
      serviceDuration: rawProduct.ServicesProduct?.serviceDuration,
    };
    return { success: true, data: product };
  } catch (error) {
    return { success: false, error: 'Can not fetch product' };
  }
};
export default getServiceProductById;
