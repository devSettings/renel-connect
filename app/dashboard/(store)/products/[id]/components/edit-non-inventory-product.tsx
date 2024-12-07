'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Category } from '@prisma/client';
import { toast } from 'sonner';

import { z } from 'zod';
import getCategories from '../../create/actions/get-product-category';
import editNonInventoryProduct from '../actions/edit-non-inventory-product';
import getNonInventoryProductById, {
  NonInventoryProduct,
} from '../actions/get-non-inventory-product-by-id';
import editNonInventoryProductSchema from '../schema/edit-non-inventory-product';

type FormData = z.infer<typeof editNonInventoryProductSchema>;
interface Props {
  OnEditSuccess: () => void;
  id: string;
}
export default function EditNonInventoryProductForm({
  OnEditSuccess,
  id,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [product, setProduct] = useState<NonInventoryProduct>();

  const form = useForm<FormData>({
    resolver: zodResolver(editNonInventoryProductSchema),
    defaultValues: {
      id,
      name: product?.name,
      status: product?.status,
      sellingPrice: product?.sellingPrice,
      category: product?.category,
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await getNonInventoryProductById(id);
      if (!response.success) {
        toast.error(response.error as string);
        return '';
      }
      setProduct(response.data);
      // Update the form values dynamically
      form.reset({
        id: id,
        name: response.data.name,
        status: response.data.status,
        sellingPrice: response.data.sellingPrice,
        category: response.data.category,
      });
    };
    fetchProduct();
  }, [id, form]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories({
        search: query,
        pageSize: 5,
      });
      if (!response.success) {
        toast.error(response.error as string);
        return;
      }
      setCategories(response.data as Category[]);
    };
    fetchCategories();
  }, [query, open]);

  async function onSubmit(data: FormData) {
    const result = await editNonInventoryProduct(data);
    if (!result?.success) {
      toast.error(result.error as string);
      return;
    }
    toast.success('Product created successfully');
    form.reset();
    router.refresh();
    OnEditSuccess();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 px-4 py-8'
      >
        <div className='grid grid-cols-2 gap-6'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <span className='text-red-500'>*</span>

                <FormControl>
                  <Input placeholder='New Product' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <div className='flex items-center mb-1'>
                  <FormLabel>Category Name</FormLabel>
                  <span className='text-red-500'>*</span>
                </div>
                <Popover open={open} onOpenChange={setOpen}>
                  <div className='flex items-center gap-2'>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          aria-expanded={open}
                          className='w-full justify-between font-normal shadow-none  border h-10'
                        >
                          {field.value
                            ? categories.find(
                                (customer) => customer.id === field.value
                              )?.name
                            : 'Category List'}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                  </div>

                  <PopoverContent className='w-[285px] p-0 shadow-none border'>
                    <Command>
                      <div className='m-2'>
                        <Input
                          placeholder='Search Category...'
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                      </div>
                      <CommandList className='border-[0.1px] mx-2 mb-2 rounded-lg '>
                        <CommandEmpty>No category found</CommandEmpty>
                        <CommandGroup>
                          {categories.map((category) => (
                            <CommandItem
                              key={category.id}
                              onSelect={() => {
                                form.setValue('category', category.id);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value === category.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {category.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='sellingPrice'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling Price</FormLabel>
                <span className='text-red-500'>*</span>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='0.1'
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === '' ? '' : Number(e.target.value)
                      )
                    }
                    onBlur={(e) =>
                      field.onChange(
                        e.target.value === '' ? '' : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <span className='text-red-500'>*</span>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='ACTIVE'>Active</SelectItem>
                    <SelectItem value='ARCHIVED'>Archived</SelectItem>
                    <SelectItem value='DRAFT'>Draft</SelectItem>
                    <SelectItem value='INACTIVE'>Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex items-center justify-end mt-10'>
          <Button
            className='bg-blue-700 hover:bg-blue-700 text-white'
            type='submit'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
