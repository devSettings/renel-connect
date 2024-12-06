'use client';

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
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import FormDialog from '@/app/dashboard/components/form-dialog';
import { toast } from 'sonner';
import { z } from 'zod';
import getSimpleInventoryProducts from '../../products/actions/get-simple-inventory-products';
import getSimpleSuppliers from '../../products/actions/get-simple-supliers';
import CreateInventoryProductForm from '../../products/create/components/create-inventory-product-form';
import createAquisition from '../actions/create-transactions';
import createAquisitionSchema from '../schema/create-aquisition';
import CreateProductSupplierForm from './create-product-supplier-form';

interface Props {
  OnCreateSuccess: () => void;
}

const CreateAquisitionForm = ({ OnCreateSuccess }: Props) => {
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const [productQuery, setProductQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingProduct, setCreatingProduct] = useState(false);

  const [supplierQuery, setSupplierQuery] = useState<string>();
  const [supplierOpen, setSupplierOpen] = useState<boolean>(false);
  const [creatingSupplier, setCreatingSupplier] = useState<boolean>(false);

  useEffect(() => {
    const getInventoryProducts = async () => {
      const response = await getSimpleInventoryProducts({
        search: productQuery,
        count: 10,
      });
      if (response?.success) {
        setProducts(response.data);
        return;
      }
    };
    getInventoryProducts();
  }, [productQuery, isOpen]);

  useEffect(() => {
    const getSuppliers = async () => {
      const response = await getSimpleSuppliers();
      if (response.success) {
        setSuppliers(response.data);
        return;
      }
    };
    getSuppliers();
  }, [supplierQuery, supplierOpen]);

  type FormData = z.infer<typeof createAquisitionSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(createAquisitionSchema),
    defaultValues: {
      product: undefined,
      quantityBought: undefined,
      typeOfTransaction: 'AQUISITION',
      acquisitionDate: undefined,
      avarageUnitCostPrice: undefined,
      supplier: undefined,
      expiryDate: undefined,
    },
  });
  const handleTransactionSubmit = async (data: FormData) => {
    const reponse = await createAquisition(data);
    if (!reponse.success) {
      toast.error(reponse.error as string);
      return;
    }
    toast.success('Transaction created Successly');
    OnCreateSuccess();
  };

  return (
    <Form {...form}>
      <form
        className='space-y-8 px-4 py-8'
        onSubmit={form.handleSubmit(handleTransactionSubmit)}
      >
        <div className='grid grid-cols-2 gap-x-8 gap-y-6 p-4'>
          <FormField
            control={form.control}
            name='product'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <div className='flex items-center mb-2'>
                  <FormLabel>
                    Product Name <span className='text-red-600'>*</span>
                  </FormLabel>
                </div>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <div className='flex items-center gap-2'>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          aria-expanded={isOpen}
                          className='w-full justify-between font-normal shadow-non border h-10'
                        >
                          {field.value
                            ? products.find(
                                (product) => product.id === field.value
                              )?.name
                            : 'List of products'}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <FormDialog
                      title={''}
                      description={''}
                      trigger={''}
                      isOpen={isCreatingProduct}
                      setOpen={() => setCreatingProduct(!isCreatingProduct)}
                    >
                      <CreateInventoryProductForm
                        upOnSubmitting={() =>
                          setCreatingProduct(!isCreatingProduct)
                        }
                      />
                    </FormDialog>
                  </div>

                  <PopoverContent className='w-[265px] p-0 shadow-none border '>
                    <Command>
                      <div className='m-2'>
                        <Input
                          placeholder='search categories...'
                          value={productQuery}
                          onChange={(e) => setProductQuery(e.target.value)}
                        />
                      </div>
                      <CommandList className='border-[0.1px] mx-2 mb-2 rounded-lg bg-[#0D0E10]'>
                        <CommandEmpty>No Products Found</CommandEmpty>
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
            name='supplier'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <div className='flex items-center mb-2'>
                  <FormLabel>
                    Supplier <span className='text-red-600'>*</span>
                  </FormLabel>
                </div>
                <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                  <div className='flex items-center gap-2'>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          aria-expanded={supplierOpen}
                          className='w-full justify-between font-normal shadow-non border h-10'
                        >
                          {field.value
                            ? suppliers.find(
                                (supplier) => supplier.id === field.value
                              )?.name
                            : 'Listes of Suppliers'}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <FormDialog
                      title=''
                      description=''
                      trigger={''}
                      isOpen={creatingSupplier}
                      setOpen={() => setCreatingSupplier(!creatingSupplier)}
                    >
                      <CreateProductSupplierForm
                        upOnSubmitting={() =>
                          setCreatingSupplier(!creatingSupplier)
                        }
                      />
                    </FormDialog>
                  </div>

                  <PopoverContent className='w-[265px] p-0 shadow-none border '>
                    <Command>
                      <div className='m-2'>
                        <Input
                          placeholder='Search for a supplier...'
                          value={supplierQuery}
                          onChange={(e) => setSupplierQuery(e.target.value)}
                        />
                      </div>
                      <CommandList className='border-[0.1px] mx-2 mb-2 rounded-lg bg-[#0D0E10]'>
                        <CommandEmpty>No supplier found</CommandEmpty>
                        <CommandGroup>
                          {suppliers.map((supplier) => (
                            <CommandItem
                              key={supplier.id}
                              onSelect={() => {
                                form.setValue('supplier', supplier.id);
                                setSupplierOpen(!supplierOpen);
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  field.value === supplier.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {supplier.name}
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
            name='quantityBought'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Quantity Bought <span className='text-red-600'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder=''
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
            name='avarageUnitCostPrice'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Unit Cost Price <span className='text-red-600'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder=''
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
            name='acquisitionDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel className='mb-2'>
                  Acquisition Date <span className='text-red-600'>*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
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
            name='expiryDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel className='mb-2'>Expiry Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
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
        </div>
        <div className='flex justify-end pr-4'>
          <Button
            size='lg'
            className='bg-blue-600 shadow-none text-white hover:bg-blue-800 transition-colors ease-linear duration-300'
          >
            Create Transaction
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateAquisitionForm;
