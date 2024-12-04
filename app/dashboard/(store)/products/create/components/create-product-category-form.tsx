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
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { z } from 'zod';
import createProductCategorySchema from '../schema/create-product-category';
import createProductCategory from '../actions/create-product-category';

interface Props {
  onCreateSucess: () => void;
}

type FormData = z.infer<typeof createProductCategorySchema>;

const CreateProductCategoryForm = ({ onCreateSucess }: Props) => {
  const form = useForm<FormData>({
    resolver: zodResolver(createProductCategorySchema),
    defaultValues: {
      title: '',
    },
  });

  const handleSubmiting = async (data: FormData) => {
    const response = await createProductCategory(data as FormData);

    if (response.success) {
      toast.success('Category created successfully.');
      onCreateSucess();
      form.reset();
    }

    if (!response.success) {
      toast.error(response.error as String);
    }
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

export default CreateProductCategoryForm;
