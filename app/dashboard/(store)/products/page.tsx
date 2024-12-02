import Search from '@/components/search';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Suspense } from 'react';
import ProductsTable from './components/products-table';
import ProductsMatrix from './components/product-matrix';
export const products: Products[] = [
  {
    id: 'PROD001',
    code: 'A123',
    name: 'Wireless Mouse',
    category: 'Electronics',
    sellingPrice: 25.99,
    status: 'ACTIVE',
    type: 'INVENTORY',
  },
  {
    id: 'PROD002',
    code: 'B456',
    name: 'Office Chair Assembly Service',
    category: 'Furniture Services',
    sellingPrice: 50.0,
    status: 'ACTIVE',
    type: 'SERVICE',
  },
  {
    id: 'PROD003',
    code: 'C789',
    name: 'E-Book: Learn TypeScript',
    category: 'Books',
    sellingPrice: 9.99,
    status: 'ACTIVE',
    type: 'DIGITAL',
  },
  {
    id: 'PROD004',
    code: 'D012',
    name: 'Standing Desk',
    category: 'Furniture',
    sellingPrice: 299.99,
    status: 'INACTIVE',
    type: 'INVENTORY',
  },
  {
    id: 'PROD005',
    code: 'E345',
    name: 'Consulting Session (1 Hour)',
    category: 'Professional Services',
    sellingPrice: 100.0,
    status: 'DRAFT',
    type: 'SERVICE',
  },
  {
    id: 'PROD006',
    code: 'F678',
    name: 'Printer Ink Cartridge',
    category: 'Office Supplies',
    sellingPrice: 19.99,
    status: 'ACTIVE',
    type: 'INVENTORY',
  },
  {
    id: 'PROD007',
    code: 'G910',
    name: 'Website Hosting (1 Year)',
    category: 'Web Services',
    sellingPrice: 120.0,
    status: 'ACTIVE',
    type: 'DIGITAL',
  },
  {
    id: 'PROD008',
    code: 'H112',
    name: 'Old Model Smartphone',
    category: 'Electronics',
    sellingPrice: 150.0,
    status: 'ARCHIVED',
    type: 'INVENTORY',
  },
];
const ProductPage = () => {
  return (
    <div className='space-y-8'>
      <ProductsMatrix />
      <Card className='shadow-none  flex-1 overflow-hidden border-[0.1px]   bg-[#0a0a0a] '>
        <CardHeader>
          <div className='flex items-center gap-2 justify-between'>
            <div className='flex items-center gap-4'>
              <Suspense fallback={<div>Loading search...</div>}>
                <Search />
              </Suspense>
              {/* <MobileFilterDrawer /> */}
            </div>
            {/* <CreateCustomer /> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className='block lg:hidden'>{/* <CustomerList /> */}</div>
          <div className='hidden lg:block'>
            <ProductsTable
              products={products}
              totalPages={1}
              currentPage={1}
              itemsPerPage={1}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductPage;
