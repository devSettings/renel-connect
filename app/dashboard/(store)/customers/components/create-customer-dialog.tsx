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
import { CreateUserCustomerForm } from './create-customer-form';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

const CreateCustomerDialog = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-blue-700 hover:bg-blue-900 text-white'>
          Create Customer
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-[800px]'>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            <Card className='border-[0.1px] rounded-md'>
              <CardContent>
                <div className='pt-8'>
                  <CreateUserCustomerForm
                    OnCreateSuccess={() => setOpen(!isOpen)}
                  />
                </div>
              </CardContent>
            </Card>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default CreateCustomerDialog;
