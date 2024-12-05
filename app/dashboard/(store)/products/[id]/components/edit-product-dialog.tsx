'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Card, CardContent } from '@/components/ui/card';
import { ProductType } from '@prisma/client';
import { useEffect, useState } from 'react';
import getProductById from '../actions/get-product-by-id';
import EditInventoryProductForm from './edit-inventory-product';

interface Props {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const EditProductFormDialog = ({ id, isOpen, onClose }: Props) => {
  const [product, setProduct] = useState<{
    id: string;
    name: string;
    sellingPrice: number;
    type: ProductType;
    category: string;
    reOrderLevel: number;
  }>();

  useEffect(() => {
    const fetchProduct = async () => {
      const reponse = await getProductById(id);
      if (!reponse.success) return null;
      setProduct({
        id: reponse.data.id,
        name: reponse.data.name,
        sellingPrice: reponse.data.sellingPrice,
        type: reponse.data.type,
        category: reponse.data.category,
        reOrderLevel: reponse.data.reOrderLevel,
      });
    };
    fetchProduct();
  }, []);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-[65vw]'>
        <div className='flex justify-between mr-6'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'>
              {product?.name}
            </DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to your inventory. Ensure
              the information is accurate for seamless tracking and management.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Card className='border-[0.1px]'>
          <CardContent>
            {product?.type === 'INVENTORY' && (
              <EditInventoryProductForm
                id={id}
                name={product.name}
                sellingPrice={product.sellingPrice}
                OnEditSuccess={onClose}
                status={'ACTIVE'}
                category={product.category}
                reOrderLevel={product.reOrderLevel}
              />
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductFormDialog;
