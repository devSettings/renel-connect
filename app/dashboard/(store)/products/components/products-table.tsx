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
import { Suspense } from 'react';
import { Product } from '../types/product';
import ProductStatusBadge from './product-status.badge';
import ProductTypeBadge from './product-type-badge';
import TableAction from './table-action';

interface Props {
  products: Product[];
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

const tableHeads = [
  'Product',
  'Type',
  'Selling Price',
  'Category',
  'Status',
  'Stock',
  'Action',
];

export default function ProductsTable({
  products,
  totalPages,
  currentPage,
}: Props) {
  if (products.length === 0) {
    return (
      <EmptyTable
        heading='No product found!'
        description='There are no products in the database - add a product to appear here'
      />
    );
  }
  return (
    <div className=''>
      <Card className='dark:bg-black border-[0.1px] shadow-none overflow-hidden'>
        <CardContent className='pt-4'>
          <Table>
            <TableHeader>
              <TableRow className=' h-14'>
                <TableHead>
                  <Checkbox className='border-[0.1px] rounded-md shadow-none'></Checkbox>
                </TableHead>
                {tableHeads.map((head, index) => (
                  <TableHead
                    key={index}
                    className={cn('text-sm text-nowrap  font-normal')}
                  >
                    {head}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow
                  key={product.name}
                  className={cn('cursor-pointer h-14 boorder-[0.1px]', {
                    ' bg-[#0a0a0a]': index % 2 === 0,
                  })}
                >
                  <TableCell>
                    <Checkbox className='border-[0.1px] rounded-md shadow-none' />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <ProductTypeBadge type={product.type} />
                  </TableCell>
                  <TableCell>{product.sellingPrice}</TableCell>
                  <TableCell className='overflow-hidden '>
                    {product.category}
                  </TableCell>
                  <TableCell>
                    <ProductStatusBadge status={product.status} />
                  </TableCell>
                  <TableCell>{product.quantityInStock}</TableCell>
                  <TableCell aria-disabled={true}>
                    <TableAction
                      id={product.id}
                      type={product.type}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className='overflow-hidden'>
          <Suspense fallback={<div>Loading pagination...</div>}>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
            />
          </Suspense>
        </CardFooter>
      </Card>
    </div>
  );
}
