import Search from '@/components/search';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Suspense } from 'react';
import MobileFilterDrawer from '../../components/mobile-filter-drawer';
import CreateCustomer from './components/create-customer';
import CustomerList from './components/customer-list';
import CustomersMatrix from './components/customers-matrix';
import CustomersTable, { CustomerTable } from './components/customers-table';
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
    phoneNumber: '3930-93847-39',
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
    <div className='space-y-8'>
      <CustomersMatrix />
      <Card className='shadow-none  flex-1 overflow-hidden border-[0.1px]  bg-[#0a0a0a] '>
        <CardHeader>
          <div className='flex items-center gap-2 justify-between'>
            <div className='flex items-center gap-4'>
              <Suspense fallback={<div>Loading search...</div>}>
                <Search />
              </Suspense>
              <MobileFilterDrawer />
            </div>
            <CreateCustomer />
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
  );
};

export default HomePage;
