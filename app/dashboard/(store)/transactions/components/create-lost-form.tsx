'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdDataSaverOff, MdOutlineDataSaverOn } from 'react-icons/md';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { z } from 'zod';
import getSimpleInventoryProducts from '../../products/actions/get-simple-inventory-products';
import { createLost } from '../actions/create-lost';
import createLostSchema from '../schema/create-lost';

interface CreateLostFormProps {
  onSubmitSuccess: () => void;
}

type FormData = z.infer<typeof createLostSchema>;

export function CreateLostForm({ onSubmitSuccess }: CreateLostFormProps) {
  const [products, setProducts] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(createLostSchema),
    defaultValues: {
      product: '',
      description: '',
      quantityLost: undefined,
      lostDate: undefined,
      typeOfTransaction: 'LOST',
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getSimpleInventoryProducts({
        search: query,
        count: 10,
      });
      if (response?.success) {
        setProducts(response.data);
      }
    };
    fetchProducts();
  }, [query]);

  const handleSubmit = async (data: FormData) => {
    const response = await createLost(data);
    if (!response.success) {
      toast.error(response.error as string);
      return;
    }
    toast.success('Transaction added successfully');
    onSubmitSuccess();
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        className='space-y-8 px-4 py-8'
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4'>
          <FormField
            control={form.control}
            name='product'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>
                  Product Name <span className='text-red-600'>*</span>
                </FormLabel>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        aria-expanded={isOpen}
                        className='w-full justify-between font-normal'
                      >
                        {field.value
                          ? products.find(
                              (product) => product.id === field.value
                            )?.name
                          : 'Select a product'}
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-[320px] p-0'>
                    <Command>
                      <div className='p-2'>
                        <Input
                          placeholder='Search products...'
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                      </div>
                      <CommandList>
                        <CommandEmpty>No products found</CommandEmpty>
                        <CommandGroup>
                          {products.map((product) => (
                            <CommandItem
                              key={product.id}
                              onSelect={() => {
                                form.setValue('product', product.id);
                                setIsOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value === product.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {product.name}
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
            name='quantityLost'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Quantity Lost <span className='text-red-600'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='1'
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lostDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>
                  Lost Date <span className='text-red-600'>*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='typeOfTransaction'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Type of Transaction <span className='text-red-600'>*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Type of Transaction' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='LOST'>Lost</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='col-span-full'>
                <FormLabel>
                  Description <span className='text-red-600'>*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='A brief description of why this product is considered lost.'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-end pr-4'>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='bg-blue-700 text-white hover:bg-blue-800 transition-colors duration-300'
          >
            {form.formState.isSubmitting ? (
              <div className='flex items-center gap-x-1'>
                <MdDataSaverOff className='w-5 h-5 animate-spin' />
                Creating...
              </div>
            ) : (
              <div className='flex items-center gap-x-1'>
                <MdOutlineDataSaverOn className='w-5 h-5' />
                Create Lost
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
