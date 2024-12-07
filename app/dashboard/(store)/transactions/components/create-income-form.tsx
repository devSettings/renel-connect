'use client';
import { format } from 'date-fns';

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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import createIncome from '../actions/create-income';
import createIncomeSchema from '../schema/create-income';

interface Props {
  upOnSubmitting: (data: FieldValues) => void;
}

type IncomeCategory = {
  id: string;
  value: string;
  name: string;
};

type FormData = z.infer<typeof createIncomeSchema>;

const CreateIncomeForm = ({ upOnSubmitting }: Props) => {
  const [categories, setCategories] = useState<IncomeCategory[]>([
    {
      id: 'INVESTMENT',
      value: 'INVESTMENT',
      name: 'Investment',
    },
    {
      id: 'LOAN',
      value: 'LOAN',
      name: 'Loan',
    },
  ]);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(createIncomeSchema),
    defaultValues: {
      title: '',
      description: '',
      amount: undefined,
      typeOfTransaction: 'INCOME',
      IncomeDate: undefined,
    },
  });

  const handleTransactionSubmit = async (data: FormData) => {
    const response = await createIncome(data);
    if (!response.success) {
      toast.error(response.message);
      return;
    }
    toast.success('Income created successfully');
    upOnSubmitting(data);
    form.reset();
  };
  return (
    <Form {...form}>
      <form
        className='space-y-8 px-4 py-8'
        onSubmit={form.handleSubmit(handleTransactionSubmit)}
      >
        <div className='grid grid-cols-2 gap-x-6 gap-y-6 p-4'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className='text-red-600'>*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder='' {...field} />
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
                <div className='flex items-center mb-2'>
                  <FormLabel>
                    Nom de la catégorie <span className='text-red-600'>*</span>
                  </FormLabel>
                </div>
                <Popover open={open} onOpenChange={setOpen}>
                  <div className='flex items-center gap-2'>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          aria-expanded={open}
                          className='w-full justify-between font-normal shadow-non border h-10'
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
                    {/* <CategoryFormModal /> */}
                  </div>

                  <PopoverContent className='w-[265px] p-0 shadow-none border '>
                    <Command>
                      <div className='m-2'>
                        <Input
                          placeholder='Rechercher une catégorie...'
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                      </div>
                      <CommandList className='border-[0.1px] mx-2 mb-2 rounded-lg bg-[#0D0E10]'>
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
            name='amount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Amount <span className='text-red-600'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
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
            name='IncomeDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel className='mb-2'>
                  Income Date <span className='text-red-600'>*</span>
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

          <div className='col-span-2'>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder='' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className='flex justify-end pr-4'>
          <Button
            size='lg'
            className='bg-blue-700 text-white hover:bg-blue-800 transition-colors ease-linear duration-300'
          >
            Create Income
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateIncomeForm;