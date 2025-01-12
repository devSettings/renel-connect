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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Card, CardContent } from '@/components/ui/card';
import { TypeOfTransaction } from '@prisma/client';
import { useState } from 'react';
import CreateAquisitionForm from './create-aquisition-form';
import CreateExpenseForm from './create-expense-form';
import CreateIncomeForm from './create-income-form';
import { CreateLostForm } from './create-lost-form';
import useUserRole from '@/lib/use-user-role';

const CreateTransactionFormDialog = () => {
  const role = useUserRole();
  const hasPermission = role === 'ADMIN' || role === 'DEVELOPER' ? true : false;
  const [open, setOpen] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] =
    useState<TypeOfTransaction>('EXPENSE');

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          disabled={!hasPermission}
          className='font-normal bg-blue-700 hover:bg-blue-800 text-white transition-colors ease-in-out duration-300'
        >
          <IoMdAddCircle />
          New Transaction
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-[65vw] bg-black border-[0.1px] rounded-md'>
        <div className='flex justify-between mr-8'>
          <DialogHeader>
            <DialogTitle className='text-2xl font-bold'></DialogTitle>
            <DialogDescription className='max-w-[35vw]'></DialogDescription>
          </DialogHeader>
          <Select
            defaultValue='EXPENSE'
            onValueChange={(transaction) =>
              setSelectedTransactionType(transaction as TypeOfTransaction)
            }
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='EXPENSE'>Expense</SelectItem>
              <SelectItem value='INCOME'>Income</SelectItem>
              <SelectItem value='LOST'>Lost</SelectItem>
              <SelectItem value='AQUISITION'>Acquisition</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className='border-[0.1px] rounded-md'>
          <CardContent>
            {selectedTransactionType === 'EXPENSE' && (
              <CreateExpenseForm upOnSubmitting={() => setOpen(!open)} />
            )}
            {selectedTransactionType === 'AQUISITION' && (
              <CreateAquisitionForm OnCreateSuccess={() => setOpen(!open)} />
            )}
            {selectedTransactionType === 'INCOME' && (
              <CreateIncomeForm upOnSubmitting={() => setOpen(!open)} />
            )}
            {selectedTransactionType === 'LOST' && (
              <CreateLostForm onSubmitSuccess={() => setOpen(!open)} />
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionFormDialog;
