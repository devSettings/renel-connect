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
import { useState } from 'react';
import { CreateUserCustomerForm } from '../../customers/create/create-customer-form';

const CreateCustomerFormDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='font-normal bg-blue-700 hover:bg-blue-800 text-white transition-colors ease-in-out duration-300'>
          <IoMdAddCircle />
          New customer
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[65vw] bg-black'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            {/* Create new customer */}
          </DialogTitle>
          <DialogDescription>
            {/* This action cannot be undone. This will permanently delete your
            account and remove your data from our servers. */}
          </DialogDescription>
        </DialogHeader>
        <Card className='bg-[#0a0a0a]'>
          <CardContent>
            <CreateUserCustomerForm />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCustomerFormDialog;
