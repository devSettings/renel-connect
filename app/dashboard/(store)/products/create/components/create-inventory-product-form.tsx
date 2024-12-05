'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
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

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { Category } from '@prisma/client';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';
import createInventoryProductSchema from '../schema/create-inventory-product';
import { z } from 'zod';
import CreateProductCategoryFormDialog from './create-product-category-form-dialog';
import BarCodeTooltip from './bar-code-tooltip';
import getCategories from '../actions/get-product-category';
import createInventoryProduct from '../actions/create-inventory-product';

interface Props {
  upOnSubmitting: (data: FieldValues) => void;
}

type FormData = z.infer<typeof createInventoryProductSchema>;
export default function EditInventoryProductForm({ upOnSubmitting }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const form = useForm<FormData>({
    resolver: zodResolver(createInventoryProductSchema),
    defaultValues: {
      productType: 'INVENTORY',
      name: '',
      status: undefined,
      sellingPrice: undefined,
      reorderLevel: undefined,
      category: undefined,
    },
  });

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

  const handleSubmitProduct = async (data: FormData) => {
    const result = await createInventoryProduct(data);
    if (!result?.success) {
      toast.error(result.error as String);
      return;
    }
    toast.success('Product created Successfully');
    form.reset();
    router.refresh();
    upOnSubmitting(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitProduct)}>
        <div className='grid grid-cols-2 gap-x-6 gap-y-6 px-4 py-8'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l&apos;article</FormLabel>
                <span className='text-red-500'>*</span>
                <FormControl>
                  <Input placeholder='Nouvel article' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='sku'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1 mb-1.5'>
                  <FormLabel>Bar Code</FormLabel>
                  <BarCodeTooltip />
                </div>
                <FormControl>
                  <Input placeholder='0000000000' {...field} />
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
                  <FormLabel>Nom de la catégorie</FormLabel>
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
                            : 'Listes de catégories'}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <CreateProductCategoryFormDialog />
                  </div>

                  <PopoverContent className='w-[285px] p-0 shadow-none border'>
                    <Command>
                      <div className='m-2'>
                        <Input
                          placeholder='Rechercher une catégorie...'
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                      </div>
                      <CommandList className='border-[0.1px] mx-2 mb-2 rounded-lg '>
                        <CommandEmpty>Aucune catégorie trouvée</CommandEmpty>
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
                <FormLabel>Prix de vente</FormLabel>
                <span className='text-red-500'>*</span>
                <FormControl>
                  <Input
                    type='number'
                    placeholder=''
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
            name='reorderLevel'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seuil</FormLabel>
                <span className='text-red-500'>*</span>
                <FormControl>
                  <Input
                    type='number'
                    placeholder=''
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
                <FormLabel>Statut</FormLabel>
                <span className='text-red-500'>*</span>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Statut de l'article" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='ACTIVE'>Active</SelectItem>
                    <SelectItem value='DRAFT'>Draft</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex items-center justify-end mt-10'>
          <Button
            className='bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 ease-in-out'
            type='submit'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'En cours...' : 'Soumettre'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
