import { EllipsisIcon as EllipsisHorizontal } from 'lucide-react';

// import Pagination from '@/components/pagination';
import EmptyTable from '@/app/dashboard/components/empty-table';
import Pagination from '@/app/dashboard/components/pagination';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Customer } from '../types/customers';
import CustomerMembershipBadge from './customer-membership-badge';
import CustomerStatusBadge from './customer-status-badge';
import { Suspense } from 'react';

const TABLE_HEADS = [
  'Customer',
  'Status',
  'Phone Number',
  'Total Orders',
  'Total Spend',
  'Membership',
  // 'Last Order Date',
  'Action',
] as const;

interface Props {
  customers: Customer[];
  totalPages: number;
  currentPage: number;
}

export default function CustomersTable({
  customers,
  totalPages,
  currentPage,
}: Props) {
  if (customers.length === 0) {
    return (
      <EmptyTable
        heading='No customers found!'
        description='There may be no customers in the database. or we can not find the ones that match your filter query'
      />
    );
  }

  return (
    <Card className=' border-[0.1px]  bg-black overflow-hidden '>
      <CardContent className='pt-4'>
        <Table>
          <TableHeader>
            <TableRow className='h-14'>
              <TableHead>
                <Checkbox className='border-[0.1px]  rounded-md shadow-none' />
              </TableHead>
              {TABLE_HEADS.map((head) => (
                <TableHead key={head} className='text-sm font-normal'>
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow
                key={customer.id}
                className={cn('cursor-pointer h-14', {
                  'bg-accent/10': index % 2 === 0,
                })}
              >
                <TableCell>
                  <Checkbox className='border-[0.1px] rounded-md' />
                </TableCell>

                <TableCell>{customer.name}</TableCell>
                <TableCell>
                  <CustomerStatusBadge status={customer.status} />
                </TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell className='text-center'>
                  {customer.totalOrders}
                </TableCell>
                <TableCell className='text-center'>
                  {customer.totalSpend}
                </TableCell>
                <TableCell>
                  <CustomerMembershipBadge membership={customer.membership} />
                </TableCell>
                {/* <TableCell className='text-center'>
                  {customer.lastPurchaseDate
                    ? customer.lastPurchaseDate
                    : 'N/A'}
                </TableCell> */}
                <TableCell>
                  <EllipsisHorizontal className='w-4 h-4' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className='overflow-hidden bg-accent/20'>
        <Suspense fallback={'loading'}>
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </Suspense>
      </CardFooter>
    </Card>
  );
}
