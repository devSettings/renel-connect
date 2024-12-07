'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IoMdAddCircle } from 'react-icons/io';

import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

interface FormDialogProps {
  children: ReactNode;
  title: string;
  description: string;
  trigger: string;
  isOpen: boolean;
  setOpen: () => void;
}

const FormDialog = ({
  children,
  title,
  description,
  trigger,
  isOpen,
  setOpen,
}: FormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='font-normal text-blue-600 hover:text-blue-700 border-blue-700 border-[0.1px] transition-colors ease-in-out duration-300'
        >
          <IoMdAddCircle />
          {trigger}
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-[65vw]'>
        <div className='flex  justify-between mr-6'>
          <DialogHeader>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        </div>

        <Card className='border-[0.1px] rounded-md'>
          <CardContent>{children}</CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
