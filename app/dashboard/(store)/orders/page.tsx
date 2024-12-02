import Search from '@/components/search';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Suspense } from 'react';
import OrdersMatrix from './components/orders-matrix';
import OrdersTable from './components/orders-table';
type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'RETURNED';
type OrderSource = 'ONLINE' | 'IN_STORE' | 'MOBILE_APP' | 'PHONE';

export const orders = [
  {
    order_id: 'ORD001',
    customer: 'John Doe',
    status: 'COMPLETED',
    source: 'ONLINE',
    quanity_of_items: 3,
    total: 120.5,
    date: '2024-12-01',
  },
  {
    order_id: 'ORD002',
    customer: 'Jane Smith',
    status: 'PENDING',
    source: 'MOBILE_APP',
    quanity_of_items: 2,
    total: 49.99,
    date: '2024-12-02',
  },
  {
    order_id: 'ORD003',
    customer: 'Alice Johnson',
    status: 'CANCELLED',
    source: 'PHONE',
    quanity_of_items: 1,
    total: 19.99,
    date: '2024-11-30',
  },
  {
    order_id: 'ORD004',
    customer: 'Bob Brown',
    status: 'COMPLETED',
    source: 'IN_STORE',
    quanity_of_items: 10,
    total: 299.99,
    date: '2024-11-28',
  },
  {
    order_id: 'ORD005',
    customer: 'Clara Wilson',
    status: 'RETURNED',
    source: 'ONLINE',
    quanity_of_items: 5,
    total: 150.0,
    date: '2024-11-27',
  },
];
const OrderaPage = () => {
  return (
    <div className='space-y-8'>
      <OrdersMatrix />
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
            <OrdersTable orders={orders} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderaPage;
