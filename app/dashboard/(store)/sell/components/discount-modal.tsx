'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { LockKeyhole, RotateCcw, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '../hooks/use-cart-store';
import { DiscountFormValues, useDiscount } from '../hooks/use-discount';
import { discountSchema } from '../schema/discount';

export default function DiscountModal() {
  const [open, setOpen] = useState(false);
  const { setDiscount, resetDiscount, discountPercentage } = useDiscount();
  const { items } = useCartStore();

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      discountType: 'PERCENTAGE',
      discountValue: 0,
      confirmationCode: '',
    },
  });

  function onSubmit(data: DiscountFormValues) {
    setDiscount(data);
    toast.success('Discount Applied');
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          disabled={items.length === 0}
          className='w-full border-none font-normal border-gray-300 shadow-none'
          variant='secondary'
        >
          {discountPercentage >= 1 && (
            <span className='flex items-center gap-1 text-green-600'>
              <ShieldCheck /> {discountPercentage} % Rabais appliqué
            </span>
          )}

          {discountPercentage === 0 && (
            <span className='flex items-center gap-2'>
              <LockKeyhole />
              Apply Discount
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Apply Discount</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='discountType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a discount type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='PERCENTAGE'>Percentage</SelectItem>
                      <SelectItem value='FIXED'>Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='discountValue'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Value</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmationCode'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmation Code</FormLabel>
                  <FormControl>
                    <Input type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-4 flex-row-reverse mt-10'>
              <Button type='submit' className='font-normal'>
                <ShieldCheck />
                Apply Discount
              </Button>
              <Button
                type='button'
                variant='outline'
                className='shadow-none  border-gray-300 border-[0.1px] font-normal'
                onClick={() => {
                  resetDiscount();
                  form.reset();
                  toast.warning('Discount Reset');
                }}
              >
                <RotateCcw />
                Reset Discount
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
