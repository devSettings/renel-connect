'use client';

import * as React from 'react';
import {
  ChevronRight,
  Search,
  Phone,
  DollarSign,
  ShoppingCart,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Customer {
  id: string;
  name: string;
  phone: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
}

const customers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '123-456-7890',
    totalOrders: 15,
    totalSpend: 1200.5,
    lastOrderDate: '24/11/2024',
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '',
    totalOrders: 5,
    totalSpend: 250.75,
    lastOrderDate: '09/10/2024',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    phone: '987-654-3210',
    totalOrders: 0,
    totalSpend: 0,
    lastOrderDate: 'N/A',
  },
  {
    id: '4',
    name: 'Bob Brown',
    phone: '555-123-4567',
    totalOrders: 45,
    totalSpend: 7890,
    lastOrderDate: '30/11/2024',
  },
  {
    id: '5',
    name: 'Clara Wilson',
    phone: '444-555-6666',
    totalOrders: 22,
    totalSpend: 3400.8,
    lastOrderDate: '29/11/2024',
  },
];

export default function CustomerList() {
  const [query, setQuery] = React.useState('');

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Customer List</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* <div className='flex space-x-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search customers'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className='pl-10'
            />
          </div>
          <Button variant='outline' size='icon' aria-label='Filter customers'>
            <Filter className='h-4 w-4' />
          </Button>
        </div> */}

        <div className='space-y-4'>
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className='overflow-hidden'>
              <CardContent className='p-0'>
                <Button
                  variant='ghost'
                  className='w-full justify-start text-left p-4 h-auto'
                >
                  <div className='flex items-center space-x-4 w-full'>
                    <Avatar className='h-10 w-10'>
                      <AvatarFallback>
                        {customer.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        {customer.name}
                      </p>
                      <div className='flex items-center text-sm text-muted-foreground'>
                        {customer.phone ? (
                          <Phone className='mr-1 h-3 w-3' />
                        ) : (
                          <span className='mr-1' aria-hidden='true'>
                            📞
                          </span>
                        )}
                        <span>{customer.phone || 'No phone'}</span>
                      </div>
                    </div>
                    <div className='flex flex-col items-end space-y-1'>
                      <div className='flex items-center text-sm'>
                        <ShoppingCart className='mr-1 h-3 w-3' />
                        <span>{customer.totalOrders}</span>
                      </div>
                      <div className='flex items-center text-sm text-muted-foreground'>
                        <DollarSign className='mr-1 h-3 w-3' />
                        <span>{customer.totalSpend.toFixed(2)}</span>
                      </div>
                    </div>
                    <ChevronRight className='h-5 w-5 text-muted-foreground' />
                  </div>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
