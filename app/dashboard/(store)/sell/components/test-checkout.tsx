'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import useQueryParameter from '@/hooks/use-query-parameter';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Bed,
  Check,
  ChevronsUpDown,
  CreditCard,
  TicketCheck,
  Wallet,
  Wine,
  XIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import { GiFoodChain } from 'react-icons/gi';
import { IoBagCheckOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import getSimpleCustomers, {
  SimpleCustomer,
} from '../../customers/actions/get-get-simple-customers';
import createOrder from '../actions/create-order';
import { useCartStore } from '../hooks/use-cart-store';
import useCheckoutModal from '../hooks/use-checkout-dialog';
import { useDiscount } from '../hooks/use-discount';
import checkOutSchema, { CheckoutFormData } from '../schema/check-out';
import CreateCustomerFormDialog from './create-customer-form-dialog';
import BarReceipt from '../receipt/bar-receipt';
import { Item } from '../receipt/item-list';
import { PaymentMethod } from '@prisma/client';

interface Props {
  disabled: boolean;
}

export function TestCheckOut({ disabled }: Props) {
  const [data, setData] = useState<{
    transactionId: string;
    cashier: string;
    items: Item[];
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    amountReceived: number;
    change: number;
    paymentMethod: PaymentMethod;
  }>();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const { openModal, closeModal, isOpen } = useCheckoutModal();
  const { handleQuery } = useQueryParameter('searchQuery');
  const router = useRouter();

  const { resetDiscount } = useDiscount();

  const { items } = useCartStore();
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<SimpleCustomer[]>([]);

  useEffect(() => {
    const fetchcustomers = async () => {
      const response = await getSimpleCustomers();
      if (!response.success) {
        return;
      }
      setCustomers(response.data);
    };
    fetchcustomers();
  }, [query]);

  const { getTotal, clearCart } = useCartStore();
  const { calculateDiscount } = useDiscount();
  const discount = calculateDiscount(getTotal());

  const total = getTotal() - discount;
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkOutSchema),
    defaultValues: {
      paymentMethod: 'CASH',
      amountReceived: undefined,
      transactionType: undefined,
    },
  });

  const paymentMethod = useWatch({
    control: form.control,
    name: 'paymentMethod',
  });

  const category = useWatch({
    control: form.control,
    name: 'transactionType',
  });

  const amountReceived = useWatch({
    control: form.control,
    name: 'amountReceived',
  });

  const customerChange =
    paymentMethod === 'CASH' && amountReceived
      ? (amountReceived - total).toFixed(1)
      : '0.00';

  const onSubmit = async (data: CheckoutFormData) => {
    setIsLoading(true);
    const orderData = {
      category: category,
      paymentMethod: data.paymentMethod,
      subTotal: getTotal(),
      amountReceived:
        data.paymentMethod === 'CASH' ? amountReceived || 0 : total,
      customerChange: parseFloat(customerChange),
      discount: discount,
      total: total,
      tax: 0,
      transactionReceiptId: data.transactionId,
      customerId: data.customerId,
    };

    const _items = items.map((item) => {
      const sellingPrice = item.product.sellingPrice - discount;
      return {
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: sellingPrice,
        totalPrice: sellingPrice * item.quantity,
      };
    });
    const orderItemsData = _items;

    const response = await createOrder(orderData, orderItemsData);

    if (!response.success) {
      toast.error(response.error as string);
      setIsLoading(false);
      handleQuery('');
      return;
    }
    toast.success('Order created successfully');
    setData({
      transactionId: response.data.transactionId,
      cashier: response.data.cashier,
      items: response.data.items,
      subtotal: getTotal(),
      discount: discount,
      tax: 0,
      total: response.data.total,
      amountReceived: response.data.amountReceived,
      change: parseFloat(customerChange),
      paymentMethod: response.data.paymentMethod,
    });
    form.reset();
    resetDiscount();
    clearCart();
    router.refresh();
    setCompleted(true);
    setIsLoading(false);
    handleQuery('');
  };

  const handleCanel = () => {
    closeModal();
    setCompleted(false);
  };

  const handleClose = () => {
    clearCart();
    closeModal();
    router.refresh();
    setCompleted(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={openModal}
    >
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          className='w-full rounded-md py-6 text-white  text-base bg-blue-700 mt-4 hover:to-blue-900 transition-all duration-300 hover:bg-blue-900'
        >
          <IoBagCheckOutline />
          Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[1000px] bg-black rounded-2xl border-[0.1px] pb-10 '>
        <DialogHeader className='relative'>
          <DialogTitle className='text-3xl  font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-800 flex items-center justify-between'>
            <span>CheckOut</span>
            <Button
              size={'icon'}
              variant={'destructive'}
              onClick={handleCanel}
              className='absolute -top-3 -right-3 z-30'
            >
              <XIcon />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className='flex flex-col h-full py-4 px-4 border-[0.1px] bg-card rounded-md'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6 flex '
              >
                <div className='flex-1 mx-4 space-y-6 mb-4'>
                  <FormField
                    control={form.control}
                    name='paymentMethod'
                    render={({ field }) => (
                      <FormItem className='space-y-4'>
                        <FormLabel className='text-base'>
                          Payment Method
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className='grid grid-cols-3 gap-4'
                          >
                            {[
                              { value: 'CASH', label: 'Cash', icon: Wallet },
                              {
                                value: 'CREDIT_CARD',
                                label: 'Credit Card',
                                icon: CreditCard,
                              },
                              {
                                value: 'CHECK',
                                label: 'Check',
                                icon: TicketCheck,
                              },
                            ].map(({ value, label, icon: Icon }) => (
                              <Label
                                key={value}
                                htmlFor={value}
                                className={cn(
                                  `flex flex-col bg-accent/50 items-center justify-center rounded-lg border p-4 cursor-pointer hover:bg-accent/50`,
                                  {
                                    'border-primary/50': field.value === value,
                                  }
                                )}
                              >
                                <RadioGroupItem
                                  value={value}
                                  id={value}
                                  className='sr-only'
                                />
                                <Icon className='h-8 w-8 mb-4' />
                                <span>{label}</span>
                              </Label>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='transactionType'
                    render={({ field }) => (
                      <FormItem className='space-y-4'>
                        <FormLabel className='text-base'>
                          Transaction Type
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className='grid grid-cols-3 gap-4'
                          >
                            {[
                              {
                                value: 'ROOM',
                                label: 'Room',
                                icon: Bed,
                              },
                              { value: 'DRINK', label: 'Drink', icon: Wine },
                              {
                                value: 'FOOD',
                                label: 'Food',
                                icon: GiFoodChain,
                              },
                            ].map(({ value, label, icon: Icon }) => (
                              <Label
                                key={value}
                                htmlFor={value}
                                className={cn(
                                  `flex flex-col bg-accent/50 items-center justify-center rounded-lg border p-4 cursor-pointer hover:bg-accent/50`,
                                  {
                                    'border-primary/50': field.value === value,
                                  }
                                )}
                              >
                                <RadioGroupItem
                                  value={value}
                                  id={value}
                                  className='sr-only'
                                />
                                <Icon className='h-8 w-8 mb-4' />
                                <span>{label}</span>
                              </Label>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {paymentMethod === 'CASH' && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name='amountReceived'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cash Received</FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                                  G
                                </span>
                                <Input
                                  type='number'
                                  className='pl-7'
                                  placeholder='0.00'
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {paymentMethod === 'CREDIT_CARD' && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name='transactionId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transaction ID</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Entrez l'ID de transaction`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                  {paymentMethod === 'CHECK' && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name='transactionId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transaction ID</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Entrez l'ID de transaction`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormField
                      control={form.control}
                      name='customerId'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel>Customer Name</FormLabel>
                          <Popover
                            open={open}
                            onOpenChange={setOpen}
                          >
                            <div className='flex  items-center gap-2'>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant='outline'
                                    role='combobox'
                                    aria-expanded={open}
                                    className='w-full justify-between font-normal shadow-none  border-[0.1px] h-10'
                                  >
                                    {field.value
                                      ? customers.find(
                                          (customer) =>
                                            customer.id === field.value
                                        )?.firstName
                                      : 'liste des clients'}
                                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <CreateCustomerFormDialog />
                            </div>

                            <PopoverContent className='w-[400px] p-0 shadow-none border-[0.1px] '>
                              <Command>
                                <div className='m-2'>
                                  <Input
                                    placeholder='recherche client...'
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                  />
                                </div>
                                <CommandList className='border-[0.1px] mx-2 mb-2 rounded-lg '>
                                  <CommandEmpty>
                                    aucun client trouvé
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {customers.map((customer) => (
                                      <CommandItem
                                        key={customer.id}
                                        onSelect={() => {
                                          form.setValue(
                                            'customerId',
                                            customer.id
                                          );
                                          setOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            field.value === customer.id
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        {customer.firstName +
                                          ' ' +
                                          customer.lastName}
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
                  </motion.div>

                  {form.watch('transactionType') === 'ROOM' && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name='roomNumber'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Le numéro de la chambre</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Entrez le numéro de la chambre'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </div>
                <div className='lg:w-80 p-6  bg-card border-[0.1px] bg-black flex flex-col  ml-3 rounded-xl'>
                  <div className='flex-1'>
                    <h2 className='font-semibold mb-4'>Cart Summary</h2>
                    <div className='space-y-3'>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>
                          Sous-total
                        </span>
                        <span>{getTotal().toFixed(1)} G</span>
                      </div>
                      <div className='flex justify-between text-green-600'>
                        <span>Rabais</span>
                        <span>-{discount} G</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>TCA</span>
                        <span>$0.00</span>
                      </div>
                      <Separator />
                      <div className='flex justify-between font-semibold'>
                        <span>Total</span>
                        <span className='text-primary'>
                          {total.toFixed(1)} G
                        </span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className='flex justify-between text-lg font-semibold text-blue-700'
                      >
                        <span>Monnaie</span>
                        <span>{customerChange} G</span>
                      </motion.div>
                    </div>
                  </div>
                  <div className='mt-auto'>
                    {!completed && (
                      <Button
                        disabled={
                          !form.formState.isValid ||
                          form.formState.isSubmitting ||
                          (paymentMethod === 'CASH' && amountReceived! < total)
                        }
                        type='submit'
                        className='w-full mt-6 bg-blue-700 hover:bg-blue-900 text-white'
                        size='lg'
                      >
                        {isLoading ? (
                          <p className='flex items-center justify-center gap-4'>
                            <FaSpinner className='animate-spin' />
                            <span>Processing...</span>
                          </p>
                        ) : (
                          'Complete payment'
                        )}
                      </Button>
                    )}
                    {completed && (
                      <div className='flex items-center space-x-4  w-full'>
                        <Button
                          variant={'outline'}
                          className='w-full'
                          onClick={handleClose}
                        >
                          <XIcon className='w-4 h-4 mr-2' />
                          Close
                        </Button>
                        <BarReceipt
                          transactionId={data?.transactionId!}
                          cashier={data?.cashier!}
                          items={data?.items!}
                          subtotal={data?.subtotal!}
                          discount={data?.discount!}
                          tax={0}
                          total={data?.total!}
                          amountReceived={data?.amountReceived!}
                          change={data?.change!}
                          paymentMethod={data?.paymentMethod!}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
