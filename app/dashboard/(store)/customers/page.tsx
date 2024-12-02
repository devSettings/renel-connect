import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Suspense } from 'react';
import CustomersTable, { CustomerTable } from './components/customers-table';
import { ScrollArea } from '@/components/ui/scroll-area';
import CustomersMatrix from './components/customers-matrix';
import Search from '@/components/search';
import CustomerList from './components/customer-list';
export const customers: CustomerTable[] = [
  {
    customerId: 'CUST001',
    firstName: 'John',
    lastName: 'Doe',
    status: 'ACTIVE',
    totalOrders: 15,
    totalSpend: 1200.5,
    phoneNumber: '123-456-7890',
    membership: 'GOLD',
    lastPurchaseDate: new Date('2024-11-25'),
  },
  {
    customerId: 'CUST002',
    firstName: 'Jane',
    lastName: 'Smith',
    status: 'INACTIVE',
    totalOrders: 5,
    totalSpend: 250.75,
    phoneNumber: undefined,
    membership: 'SILVER',
    lastPurchaseDate: new Date('2024-10-10'),
  },
  {
    customerId: 'CUST003',
    firstName: 'Alice',
    lastName: 'Johnson',
    status: 'BANNED',
    totalOrders: 0,
    totalSpend: 0,
    phoneNumber: '987-654-3210',
    membership: 'BRONZE',
    lastPurchaseDate: null,
  },
  {
    customerId: 'CUST004',
    firstName: 'Bob',
    lastName: 'Brown',
    status: 'ACTIVE',
    totalOrders: 45,
    totalSpend: 7890.0,
    phoneNumber: '555-123-4567',
    membership: 'PLATINUM',
    lastPurchaseDate: new Date('2024-12-01'),
  },
  {
    customerId: 'CUST005',
    firstName: 'Clara',
    lastName: 'Wilson',
    status: 'ACTIVE',
    totalOrders: 22,
    totalSpend: 3400.8,
    phoneNumber: '444-555-6666',
    membership: 'GOLD',
    lastPurchaseDate: new Date('2024-11-30'),
  },
];

const HomePage = () => {
  return (
    <ScrollArea className='h-screen lg:h-[86vh]'>
      <div className='space-y-8'>
        <CustomersMatrix />
        <Card className='shadow-none border-[0.1px] flex-1 overflow-hidden  bg-accent/20'>
          <CardHeader>
            <div className='flex items-center gap-2 justify-between'>
              <div className='flex items-center gap-4'>
                <Suspense fallback={<div>Loading search...</div>}>
                  <Search />
                </Suspense>
                <div className='flex items-center gap-4'>
                  {/* <CustomerStatusSelector /> */}
                  {/* <CustomerMembershipSelector /> */}
                </div>
              </div>
              <div className='items-center gap-4 flex'>
                {/* <FormDialog /> */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='block lg:hidden'>
              <CustomerList />
            </div>
            <div className='hidden lg:block'>
              <CustomersTable
                customers={customers}
                totalPages={1}
                currentPage={1}
                itemsPerPage={1}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default HomePage;
