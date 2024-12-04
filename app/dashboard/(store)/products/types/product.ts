import { ProductStatus, ProductType } from '@prisma/client';

export type Product = {
  id: string;
  sku: string;
  name: string;
  type: ProductType;
  sellingPrice: number;
  category: string;
  status: ProductStatus;
};
