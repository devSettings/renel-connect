'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { BadgePlus, Loader } from 'lucide-react';
import { FieldValues, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import createExpenseCategory from '../actions/create-expense-category';
import { createExpenseCategorySchema } from '../schema/create-expense-category';

interface Props {
  upOnSubmitting: (data: FieldValues) => void;
}

type FormData = z.infer<typeof createExpenseCategorySchema>;

const CreateExpenseCategoryForm = ({ upOnSubmitting }: Props) => {
  const form = useForm<FormData>({
    resolver: zodResolver(createExpenseCategorySchema),
    defaultValues: {
      title: '',
    },
  });

  const handleSubmiting = async (data: FieldValues) => {
    const response = await createExpenseCategory(data as FormData);
    if (!response.success) {
      toast.error(response.error as String);
      return;
    }
    toast.success(response.data as String);
    upOnSubmitting(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmiting)}>
        <div className='flex items-center gap-2'>
          <div className='flex-1'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type='submit'
            className={cn('h-10', {})}
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting ? (
              <Loader className='animate-spin' />
            ) : (
              <p className='flex items-center gap-1'>
                <BadgePlus />
                <span>Create</span>
              </p>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateExpenseCategoryForm;
