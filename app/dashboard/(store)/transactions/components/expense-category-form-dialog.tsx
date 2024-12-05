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
import CreateExpenseCategoryForm from './create-expense-category-form';

const ExpenseCategoryFormDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <PlusCircle className='text-blue-600' />
        </Button>
      </DialogTrigger>
      <DialogContent className='py-10 bg-[#0a0a0a]'>
        <DialogHeader className='mb-4'>
          <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
          <DialogDescription>
            Créer une nouvelle catégorie signifie que vous pourrez la
            sélectionner immédiatement lors de la création de nouveaux produits.
          </DialogDescription>
        </DialogHeader>
        <CreateExpenseCategoryForm
          upOnSubmitting={() => {
            setIsOpen(!isOpen);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseCategoryFormDialog;
