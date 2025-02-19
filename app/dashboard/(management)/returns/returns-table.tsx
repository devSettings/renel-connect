'use client';

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

import { Button } from '@/components/ui/button';

import { useEffect, useState } from 'react';
import { Approved, Reject } from './action';

export type ReturnTable = {
  id: string;
  orderId: string;
  moderator: string;
  reason: string;
  Status: string;
  date: string;
  items: number;
};

interface Props {
  orders: ReturnTable[];
}

const tableHeads = ['Order ID', 'Reason', 'Date', 'Action', 'Action'];

export default function ReturnTable({ orders }: Props) {
  const [returnOrders, setReturnOrders] = useState(orders);

  useEffect(() => {
    setReturnOrders(orders);
  }, [orders]);

  const handleApprove = async (orderId: string) => {
    await Approved(orderId);
    setReturnOrders(returnOrders.filter((order) => order.orderId !== orderId));
  };

  const handleReject = async (orderId: string) => {
    await Reject(orderId);
    setReturnOrders(returnOrders.filter((order) => order.orderId !== orderId));
  };

  if (returnOrders.length === 0)
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
            {returnOrders.map((refund, index) => (
              <TableRow
                key={refund.id}
                className={cn('cursor-pointer h-14', {
                  'bg-[#0D0E10]': index % 2 === 0,
                })}
              >
                <TableCell>
                  <Checkbox className='border-[0.1px] rounded-md' />
                </TableCell>
                <TableCell>{refund.orderId}</TableCell>
                <TableCell className='truncate max-w-56'>
                  {refund.reason}
                </TableCell>
                <TableCell>{refund.date}</TableCell>

                <TableCell>
                  <Button
                    size='sm'
                    className='bg-blue-700 text-white hover:bg-blue-800'
                    onClick={() => handleApprove(refund.orderId)}
                  >
                    Approve
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    size={'sm'}
                    variant={'destructive'}
                    onClick={() => handleReject(refund.orderId)}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
