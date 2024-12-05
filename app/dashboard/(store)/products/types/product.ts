import { ProductStatus, ProductType } from '@prisma/client';
export type NotApplicable = 'N/A';
export type Product = {
  id: string;
  sku: string;
  name: string;
  type: ProductType;
  sellingPrice: number;
  category: string;
  status: ProductStatus;
  quantityInStock: number | NotApplicable;
};
