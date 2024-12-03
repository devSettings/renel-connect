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
import ProductStatusBadge from './product-status.badge';
import ProductTypeBadge from './product-type-badge';
import { EllipsisIcon } from 'lucide-react';

type Products = {
  id: string;
  code: string;
  name: string;
  category: string;
  sellingPrice: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED';
  type: 'INVENTORY' | 'NON_INVENTRORY' | 'SERVICE' | 'DIGITAL';
};

interface Props {
  products: Products[];
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

const tableHeads = [
  'Bar Code',
  'Article',
  'Type',
  'Prix ​​de vente',
  'Categorie',
  'Status',
  'Action',
];

export default function ProductsTable({
  products,
  totalPages,
  currentPage,
  itemsPerPage,
}: Props) {
  if (products.length === 0) {
    return (
      <EmptyTable
        heading='No products found!'
        description='there is no products in the database -  add one so i can show up here'
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
                    className={cn('text-sm   font-normal')}
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
                    'bg-slate-50/50 dark:bg-[#0D0E10]': index % 2 === 0,
                  })}
                >
                  <TableCell>
                    <Checkbox className='border-[0.1px] rounded-md shadow-none' />
                  </TableCell>
                  <TableCell>{product.code}</TableCell>

                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <ProductTypeBadge type={product.type} />
                  </TableCell>
                  <TableCell>{product.sellingPrice}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <ProductStatusBadge status={product.status} />
                  </TableCell>
                  <TableCell aria-disabled={true}>
                    {/* <TableAction id={product.id} /> */}
                    <EllipsisIcon />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className='dark:bg-zinc-950 overflow-hidden'>
          <Suspense fallback={<div>Loading pagination...</div>}>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          </Suspense>
        </CardFooter>
      </Card>
    </div>
  );
}