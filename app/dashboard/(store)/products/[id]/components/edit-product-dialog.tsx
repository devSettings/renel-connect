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
import EditServicesProductForm from './edit-service-product-form';

interface Props {
  id: string;
  type: ProductType;
  isOpen: boolean;
  onClose: () => void;
}

const EditProductFormDialog = ({ id, type, isOpen, onClose }: Props) => {
  // const { data: product, error } = useFetchProduct(id, type);
  // if (type === 'INVENTORY') product as unknown as InventoryProduct;
  // if (type === 'NON_INVENTORY') product as unknown as NonInventoryProduct;

  // if (error) {
  //   return (
  //     <Dialog open={isOpen} onOpenChange={onClose}>
  //       <DialogContent className='max-w-[65vw]'>
  //         <div className='text-red-500 text-center py-4'>
  //           Failed to fetch product details. Please try again later.
  //         </div>
  //       </DialogContent>
  //     </Dialog>
  //   );
  // }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-[65vw]'>
        <div className='flex justify-between mr-6'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'>
              {/* {product?.name || 'Product'} */}
            </DialogTitle>
            {/* <DialogDescription>
              Fill in the details to update the product. Ensure the information
              is accurate for seamless tracking and management.
            </DialogDescription> */}
          </DialogHeader>
        </div>
        <Card className='border-[0.1px]'>
          <CardContent>
            {/* {type === 'INVENTORY' && product && (
              <EditInventoryProductForm
                id={id}
                name={product.name}
                sellingPrice={product.sellingPrice}
                OnEditSuccess={onClose}
                status={product.status}
                category={product.category}
                reOrderLevel={(product as InventoryProduct).reOrderLevel || 0}
              />
            )} */}

            {/* {type === 'NON_INVENTORY' && product && (
              <EditNonInventoryProductForm
                id={id}
                name={product.name}
                sellingPrice={product.sellingPrice}
                OnEditSuccess={onClose}
                status={product.status}
                category={product.category}
              />
            )} */}

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
