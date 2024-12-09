'use server';
import 'server-only';

import { ActionResponse } from '@/app/types/action-reponse';
import prisma from '@/prisma/client';
import { ProductStatus, ProductType } from '@prisma/client';
import { NotApplicable, Product } from '../types/product';

type FilterOptions = {
  search?: string;
  status?: ProductStatus;
  type?: ProductType;
  pageSize?: number;
  currentPage?: number;
};

const getProducts = async (
  options: FilterOptions = {}
): Promise<ActionResponse<Product[]>> => {
  const { status, type, search, pageSize = 10, currentPage = 1 } = options;
  const skip = (currentPage - 1) * pageSize;

  try {
    const where = {
      status,
      type,
      name: search
        ? { contains: search, mode: 'insensitive' as const }
        : undefined,
    };

    const totalCount = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: { select: { name: true } },
        sellingPrice: true,
        status: true,
        sku: true,
        type: true,
        InventoryProduct: {
          select: { quantityInStock: true, productId: true },
        },
      },
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    const formattedProducts = products.map((product) => {
      return {
        id: product.id,
        sku: product.sku,
        name: product.name,
        type: product.type,
        category: product.category.name,
        sellingPrice: product.sellingPrice,
        status: product.status,
        quantityInStock:
          product.type === 'INVENTORY'
            ? product.InventoryProduct.find((p) => p.productId === product.id)
                ?.quantityInStock || 0
            : ('N/A' as NotApplicable),
      };
    });

    return {
      success: true,
      data: formattedProducts,
      //   pagination: {
      //     currentPage,
      //     pageSize,
      //     totalPages,
      //     totalCount,
      //   },
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch products: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    };
  }
};

export default getProducts;
