import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import EmptyTable from '@/app/dashboard/components/empty-table';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { EllipsisIcon } from 'lucide-react';

import { Order } from '../types/order';
import OrderSourceBadge from './order-source-badge';
import OrderAction from './order-action';

interface Props {
  orders: Order[];
}

const tableHeads = [
  'Order ID',
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
                <TableHead
                  key={head}
                  className={cn('text-sm   font-normal')}
                >
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
                <TableCell>{order.cashier}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
                  <OrderSourceBadge source={order.source} />
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>Cash</TableCell>
                <TableCell aria-disabled={true}>
                  <OrderAction id={order.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
