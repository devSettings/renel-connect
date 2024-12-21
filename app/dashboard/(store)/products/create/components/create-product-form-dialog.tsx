'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IoMdAddCircle } from 'react-icons/io';

import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductType } from '@prisma/client';
import { useState } from 'react';
import CreateInventoryProductForm from './create-inventory-product-form';
import CreateNonInventoryProductForm from './create-non-inventory-product-form';
import CreateServicesProductForm from './create-service-product-form';
import useUserRole from '@/lib/use-user-role';

const CreateProductFormDialog = () => {
  const [open, setOpen] = useState(false);
  const role = useUserRole();

  const [selectedProductType, setSelectedProductType] =
    useState<ProductType>('INVENTORY');
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          disabled={role !== 'ADMIN'}
          className='font-normal bg-blue-700 hover:bg-blue-800 text-white transition-colors ease-in-out duration-300'
        >
          <IoMdAddCircle />
          Nouveau produit
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-[65vw]'>
        <div className='flex  justify-between mr-6'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'>
              {/* Create new product */}
            </DialogTitle>
            <DialogDescription>
              {/* Fill in the details to add a new product to your inventory. Ensure
              the information is accurate for seamless tracking and management. */}
            </DialogDescription>
          </DialogHeader>
          <Select
            defaultValue='INVENTORY'
            onValueChange={(transaction) =>
              setSelectedProductType(transaction as ProductType)
            }
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='INVENTORY'>Inventaire</SelectItem>
              <SelectItem value='NON_INVENTORY'>Non Inventaire</SelectItem>
              <SelectItem value='SERVICE'>Service</SelectItem>
              <SelectItem value='DIGITAL'>Digital</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className='border-[0.1px]'>
          <CardContent>
            {selectedProductType === 'INVENTORY' ? (
              <CreateInventoryProductForm
                upOnSubmitting={() => setOpen(false)}
              />
            ) : selectedProductType === 'SERVICE' ? (
              <CreateServicesProductForm
                OnCreateSuccsess={() => setOpen(false)}
              />
            ) : (
              <CreateNonInventoryProductForm
                OnCreateSuccess={() => setOpen(false)}
              />
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductFormDialog;
