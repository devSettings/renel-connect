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
import { Sale } from '../types/report';

interface Props {
  sales: Sale[];
}

const tableHeads = [
  'Order ID',
  'Customer',
  'Cashier',
  'Items',
  'Total',
  'Category',
  'Date',
  'Action',
];

export default function SaleReportTable({ sales }: Props) {
  if (sales.length === 0)
    return (
      <EmptyTable
        heading={'No Sales found.'}
        description={'New sales will appear here!'}
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
              {tableHeads.map((head) => (
                <TableHead key={head} className={cn('text-sm   font-normal')}>
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale, index) => (
              <TableRow
                key={sale.id}
                className={cn('cursor-pointer h-14', {
                  'bg-[#0D0E10]': index % 2 === 0,
                })}
              >
                <TableCell>
                  <Checkbox className='border-[0.1px] rounded-md' />
                </TableCell>
                <TableCell>{sale.id}</TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell>{sale.cashier}</TableCell>
                <TableCell>{sale.items}</TableCell>
                <TableCell>{sale.amount}</TableCell>
                <TableCell>{sale.category}</TableCell>
                <TableCell>{sale.date}</TableCell>
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
