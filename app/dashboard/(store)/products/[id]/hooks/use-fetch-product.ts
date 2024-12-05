'use client';

import { ProductType } from '@prisma/client';
import { useEffect, useState } from 'react';
import getInventoryProductById, {
  InventoryProduct,
} from '../actions/get-inventory-product-by-id';
import getNonInventoryProductById, {
  NonInventoryProduct,
} from '../actions/get-non-inventory-product-by-id';

type ProductData<T extends ProductType> = T extends 'INVENTORY'
  ? InventoryProduct
  : T extends 'NON_INVENTORY'
  ? NonInventoryProduct
  : undefined;

const useFetchProduct = <T extends ProductType>(id: string, type: T) => {
  const [product, setProduct] = useState<ProductData<T>>();
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let response;
        if (type === 'NON_INVENTORY') {
          response = await getNonInventoryProductById(id);
        } else if (type === 'INVENTORY') {
          response = await getInventoryProductById(id);
        }

        if (!response?.success) {
          setError(true);
          return;
        }

        setProduct(response.data as ProductData<T>);
      } catch {
        setError(true);
      }
    };
    fetchProduct();
  }, [id, type]);

  return { data: product, error };
};

export default useFetchProduct;
