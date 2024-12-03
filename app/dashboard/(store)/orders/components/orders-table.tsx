import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import EmptyTable from '@/app/dashboard/components/empty-table';
import Pagination from '@/app/dashboard/components/pagination';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { EllipsisIcon } from 'lucide-react';
import { Suspense } from 'react';
import { Order } from '../types/order';
import OrderSourceBadge from './order-source-badge';

interface Props {
  orders: Order[];
}

const tableHeads = [
  'Order ID',
  'Customer',
  'Cashier',
  'Items',
  'Total',
  'Source',
  'Date',
  'Method',
  'Action',
];

export default function OrdersTable({ orders }: Props) {
  if (orders.length === 0)
    return (
      <EmptyTable
        heading={'No Orders found.'}
        description={'New orders will apear here!'}
      />
    );
  return (
    <Card className='border-[0.1px] overflow-hidden'>
      <CardContent className='pt-4'>
        <Table>
          <TableHeader>
            <TableRow className=' h-14'>
              <TableHead>
                <Checkbox className='border-[0.1px] rounded-md shadow-none'></Checkbox>
              </TableHead>
              {tableHeads.map((head, index) => (
                <TableHead key={head} className={cn('text-sm   font-normal')}>
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow
                key={order.id}
                className={cn('cursor-pointer h-14', {
                  'bg-[#0D0E10]': index % 2 === 0,
                })}
              >
                <TableCell>
                  <Checkbox className='border-[0.1px] rounded-md' />
                </TableCell>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.cashier}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <OrderSourceBadge source={order.source} />
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>Cash</TableCell>
                <TableCell aria-disabled={true}>
                  <EllipsisIcon className='w-4 h-4' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className='overflow-hidden'>
        <Suspense fallback={<div>Loading pagination...</div>}>
          <Pagination totalPages={10} currentPage={1} itemsPerPage={10} />
        </Suspense>
      </CardFooter>
    </Card>
  );
}
