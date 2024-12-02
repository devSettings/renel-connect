'use client';

import { EllipsisIcon as EllipsisHorizontal } from 'lucide-react';

// import Pagination from '@/components/pagination';
import EmptyTable from '@/app/dashboard/components/empty-table';
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
// import EmptyTableItems from '../components/empty-table-items';
// import CustomerTable from '../types/customer-table';
// import CustomerMembershipBadge from './customer-membership-badge';
// import CustomerStatusBadge from './customer-status-badge';

const TABLE_HEADS = [
  'Customer',
  'Phone Number',
  'Status',
  'Total Orders',
  'Total Spend',
  'Membership',
  'Last Order Date',
  'Action',
] as const;

export type CustomerTable = {
  customerId: string;
  firstName: string;
  lastName: string;
  status: string;
  totalOrders: number;
  totalSpend: number;
  phoneNumber: string | undefined;
  membership: string;
  lastPurchaseDate: Date | null;
};

interface Props {
  customers: CustomerTable[];
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export default function CustomersTable({
  customers,
  totalPages,
  currentPage,
  itemsPerPage,
}: Props) {
  if (customers.length === 0) {
    return (
      <EmptyTable
        heading='No customers found!'
        description='There are no customers in the database. Add one so it can show up here.'
      />
    );
  }

  return (
    <Card className=' border-[0.1px] overflow-hidden'>
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
                key={customer.customerId}
                className={cn('cursor-pointer h-14', {
                  'bg-[#0D0E10]': index % 2 === 0,
                })}
              >
                <TableCell>
                  <Checkbox className='border-[0.1px] rounded-md' />
                </TableCell>

                <TableCell>{`${customer.firstName} ${customer.lastName}`}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>
                  {/* <CustomerStatusBadge status={customer.status} /> */}
                </TableCell>
                <TableCell className='text-center'>
                  {customer.totalOrders}
                </TableCell>
                <TableCell className='text-center'>
                  {customer.totalSpend}
                </TableCell>
                <TableCell>
                  {/* <CustomerMembershipBadge membership={customer.membership} /> */}
                </TableCell>
                <TableCell className='text-center'>
                  {customer.lastPurchaseDate?.toLocaleDateString() || 'N/A'}
                </TableCell>
                <TableCell>
                  <EllipsisHorizontal className='w-4 h-4' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className='bg-zinc-950 overflow-hidden'>
        {/* <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        /> */}
      </CardFooter>
    </Card>
  );
}
