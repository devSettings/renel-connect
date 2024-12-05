'use client';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
import { Category, ProductStatus } from '@prisma/client';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import getCategories from '../../create/actions/get-product-category';
import editInventoryProduct from '../actions/edit-inventory-product';
import { editInventoryProductSchema } from '../schema/edit-inventory-product';

interface Props {
  OnEditSuccess: () => void;
  id: string;
  name: string;
  status: ProductStatus;
  sellingPrice: number;
  category: string;
  reOrderLevel: number;
}

type FormData = z.infer<typeof editInventoryProductSchema>;
export default function EditInventoryProductForm({
  OnEditSuccess,
  id,
  name,
  status,
  sellingPrice,
  category,
  reOrderLevel,
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

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

  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const form = useForm<FormData>({
    resolver: zodResolver(editInventoryProductSchema),
    defaultValues: {
      id,
      name,
      status,
      sellingPrice,
      reorderLevel: reOrderLevel,
      category,
    },
  });

  const handleSubmitProduct = async (data: FormData) => {
    const result = await editInventoryProduct(data);
    if (!result?.success) {
      toast.error(result.error as String);
      return;
    }
    toast.success('Product Sucessfully Updated');
    form.reset();
    router.refresh();
    OnEditSuccess();
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
                    <SelectItem value='ARCHIVED'>Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex items-center justify-end mt-10'>
          <Button
            className='bg-blue-700 text-white hover:bg-blue-900 transition-colors duration-300 ease-in-out'
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
