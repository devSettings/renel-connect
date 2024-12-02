import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { EllipsisIcon } from 'lucide-react';
import { Suspense } from 'react';
import Pagination from '@/app/dashboard/components/pagination';
import { OrderSource, OrderStatus } from '@prisma/client';
import OrderSourceBadge from './order-source-badge';
import OrderStatusBadge from './order-status-badge';

type Order = {
  order_id: string;
  customer: string;
  status: OrderStatus;
  source: OrderSource;
  quanity_of_items: number;
  total: number;
  date: string;
};

interface Props {
  orders: Order[];
}

const tableHeads = [
  'Order ID',
  'Customer',
  'Status',
  'Items',
  'Total',
  'Source',
  'Date',
  'Action',
];

export default function OrdersTable({ orders }: Props) {
  return (
    <Card className='bg-black border-[0.1px] overflow-hidden'>
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
                key={order.order_id}
                className={cn('cursor-pointer h-14', {
                  'bg-[#0D0E10]': index % 2 === 0,
                })}
              >
                <TableCell>
                  <Checkbox className='border-[0.1px] rounded-md' />
                </TableCell>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>{order.quanity_of_items}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>
                  <OrderSourceBadge source={order.source} />
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell aria-disabled={true}>
                  <EllipsisIcon className='w-4 h-4' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className=' bg-zinc-950 overflow-hidden'>
        <Suspense fallback={<div>Loading pagination...</div>}>
          <Pagination totalPages={10} currentPage={1} itemsPerPage={10} />
        </Suspense>
      </CardFooter>
    </Card>
  );
}
