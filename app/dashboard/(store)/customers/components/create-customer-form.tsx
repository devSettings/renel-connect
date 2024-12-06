'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import { format } from 'date-fns';
import { useState } from 'react';
import { IoMdAddCircle } from 'react-icons/io';

import { CalendarIcon, CircleX, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import createUserCustomer from '../actions/create-user-customer';
import {
  default as createUserCustomerFormSchema,
  default as createUserCustomerSchema,
} from '../schema/create-user-customer';

interface Props {
  OnCreateSuccess: () => void;
}

type FormData = z.infer<typeof createUserCustomerFormSchema>;
export function CreateUserCustomerForm({ OnCreateSuccess }: Props) {
  const years = Array.from(
    { length: new Date().getFullYear() - 18 - 1950 + 1 },
    (_, i) => 1950 + i
  );
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const form = useForm<FormData>({
    resolver: zodResolver(createUserCustomerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      gender: undefined,
      status: 'ACTIVE',
      preferredLanguage: undefined,
      membership: undefined,
      typeOfId: undefined,
      idNumber: undefined,
    },
  });

  const handleYearChange = (year: string) => {
    setCalendarDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setFullYear(parseInt(year));
      return newDate;
    });
  };

  const handleMonthChange = (month: string) => {
    setCalendarDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(months.indexOf(month));
      return newDate;
    });
  };

  const handleFormSubmit = async (data: FormData) => {
    const result = await createUserCustomer(data);

    if (!result.success) {
      toast.error(result.error as string);
    } else {
      toast.success('User customer created successfully');
      form.reset();
      OnCreateSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <div
          className={cn('grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6', {})}
        >
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='John' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder='Doe' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='birthDate'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel className='mb-2.5'>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger
                    asChild
                    className='shadow-none bg-transparent h-10'
                  >
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full  pl-3 text-left font-normal',
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
                  <PopoverContent
                    className='w-auto p-0 shadow-none'
                    align='start'
                  >
                    <div className='flex items-center justify-between space-x-2 p-3'>
                      <Select
                        onValueChange={handleMonthChange}
                        value={format(calendarDate, 'MMMM')}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Month' />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={handleYearChange}
                        value={calendarDate.getFullYear().toString()}
                      >
                        <SelectTrigger className='w-[100px]'>
                          <SelectValue placeholder='Year' />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      month={calendarDate}
                      onMonthChange={setCalendarDate}
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
            name='gender'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Gender' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='MALE'>Male</SelectItem>
                    <SelectItem value='FEMALE'>Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='john.doe@example.com'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder='50900000000' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex gap-4 w-full'>
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='ACTIVE'>Active</SelectItem>
                      <SelectItem value='INACTIVE'>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex gap-4 w-full'>
            <FormField
              control={form.control}
              name='preferredLanguage'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Preferred Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='language' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='ENGLISH'>English</SelectItem>
                      <SelectItem value='FRENCH'>French</SelectItem>
                      <SelectItem value='SPANISH'>Spanish</SelectItem>
                      <SelectItem value='CREOLE'>Creole</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='membership'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Membership</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='membership' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='BRONZE'>Bronze</SelectItem>
                      <SelectItem value='SILVER'>Silver</SelectItem>
                      <SelectItem value='GOLD'>Gold</SelectItem>
                      <SelectItem value='PLATINUM'>Platinum</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='typeOfId'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Type Of ID</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select an ID' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='PASSPORT'>Passport</SelectItem>
                    <SelectItem value='DRIVERS_LICENSE'>
                      Drivers License
                    </SelectItem>
                    <SelectItem value='GOVERMENT_ISSUED_ID'>
                      Goverment Issues ID
                    </SelectItem>
                    <SelectItem value='STUDENT_ID'>Student ID</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='idNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Number</FormLabel>
                <FormControl>
                  <Input placeholder='00000000000' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-end space-x-4 lg:pr-2 mt-10 w-full'>
          <Button variant='secondary' size={'lg'} onClick={OnCreateSuccess}>
            <CircleX />
            Cancel
          </Button>
          <Button
            type='submit'
            size='lg'
            className='font-normal w-full lg:w-fit bg-blue-700 hover:bg-blue-900  transition-colors ease-in-out duration-300 text-white'
          >
            {form.formState.isSubmitting ? (
              <div className='flex items-center gap-2'>
                <LoaderCircle className='animate-spin' />
                Creating...
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <IoMdAddCircle />
                New customer
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
