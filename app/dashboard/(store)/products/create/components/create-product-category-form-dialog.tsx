import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';

import { useState } from 'react';
import CreateProductCategoryForm from './create-product-category-form';

const CreateProductCategoryFormDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <PlusCircle className='text-blue-600' />
        </Button>
      </DialogTrigger>
      <DialogContent className='py-10 '>
        <DialogHeader>
          <DialogTitle>Create new product category</DialogTitle>
          <DialogDescription>
            {/* Créer une nouvelle catégorie signifie que vous pourrez la
            sélectionner immédiatement lors de la création de nouveaux produits. */}
          </DialogDescription>
        </DialogHeader>
        <CreateProductCategoryForm
          onCreateSucess={() => {
            setIsOpen(!isOpen);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductCategoryFormDialog;
