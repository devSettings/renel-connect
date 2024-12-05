'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Card, CardContent } from '@/components/ui/card';
import { ProductType } from '@prisma/client';
import EditInventoryProductForm from './edit-inventory-product';
import EditNonInventoryProductForm from './edit-non-inventory-product';
import EditServicesProductForm from './edit-service-product-form';

interface Props {
  id: string;
  type: ProductType;
  isOpen: boolean;
  onClose: () => void;
}

const EditProductFormDialog = ({ id, type, isOpen, onClose }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-[65vw]'>
        <div className='flex justify-between mr-6'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'></DialogTitle>
          </DialogHeader>
        </div>
        <Card className='border-[0.1px]'>
          <CardContent>
            {type === 'INVENTORY' && (
              <EditInventoryProductForm OnEditSuccess={onClose} id={id} />
            )}

            {type === 'NON_INVENTORY' && (
              <EditNonInventoryProductForm OnEditSuccess={onClose} id={id} />
            )}

            {type === 'SERVICE' && (
              <EditServicesProductForm id={id} OnCreateSuccsess={onClose} />
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductFormDialog;
