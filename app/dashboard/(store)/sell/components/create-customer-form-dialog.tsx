'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { IoMdAddCircle } from 'react-icons/io';
import { CreateUserCustomerForm } from '../../customers/components/create-customer-form';

const CreateCustomerFormDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='text-blue-700 border-[0.1px]'
        >
          <IoMdAddCircle />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[65vw] bg-black'>
        <DialogHeader></DialogHeader>
        <Card className='border-[0.1px] '>
          <CardContent className='pt-8'>
            <CreateUserCustomerForm
              OnCreateSuccess={() => {
                setOpen(!open);
              }}
            />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCustomerFormDialog;
