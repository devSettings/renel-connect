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
import { Transaction } from '../types/transactions';
import TransactionTypeBadge from './transaction-type-badge';

interface Props {
  transactions: Transaction[];
  totalPage: number;
  currentPage: number;
}

const tableHeads = [
  'Transaction ID',
  'Title',
  'Type',
  'Made By',
  'Amount',
  'Date',
  'Action',
];

export default function TransactionTable({
  transactions,
  totalPage,
  currentPage,
}: Props) {
  if (transactions.length === 0)
    return (
      <EmptyTable
        heading='No Transactions Yet'
        description='It looks like your transaction list is empty. Start by adding a transaction, and it will appear here!'
      />
    );
  return (
    <Card className='bg-black border-[0.1px] overflow-hidden'>
      <CardContent className='pt-4'>
        <Table>
          <TableHeader>
            <TableRow className='h-14'>
              <TableHead>
                <Checkbox className='border-[0.1px] rounded-md shadow-none' />
              </TableHead>
              {tableHeads.map((head) => (
                <TableHead
                  key={head}
                  className={cn('text-sm   font-normal', {})}
                >
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow
                key={transaction.id}
                className={cn('cursor-pointer h-14', {
                  'bg-[#0D0E10]': index % 2 === 0,
                })}
              >
                <TableCell>
                  <Checkbox className='border-[0.1px] rounded-md shadow-none' />
                </TableCell>
                <TableCell className=''>
                  {transaction.id.slice(0, 10).toUpperCase()}
                </TableCell>
                <TableCell>
                  {transaction.title.length > 30
                    ? transaction.title.slice(0, 30) + '...'
                    : transaction.title}
                </TableCell>
                <TableCell>
                  <TransactionTypeBadge type={transaction.type} />
                </TableCell>
                <TableCell>{transaction.madeBy}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell aria-disabled={true}>
                  <EllipsisIcon className='w-4 h-4' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className='bg-zinc-950 overflow-hidden'>
        <Suspense fallback={<div>Loading pagination...</div>}>
          <Pagination totalPages={totalPage} currentPage={currentPage} />
        </Suspense>
      </CardFooter>
    </Card>
  );
}
