import Search from '@/components/search';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Suspense } from 'react';
import getOrders from './actions/get-orders';
import getRevenue from './actions/get-revenue';
import OrderCashierFilter from './components/order-cashier-filter';
import OrdersMatrix from './components/order-metrics';
import OrderPaymentMethodFilter from './components/order-payment-method-filter';
import OrdersTable from './components/orders-table';
import { RevenueChart } from './components/revenue-chart';
import OrderError from './error';
import { hasPendingRequest } from '../../(management)/returns/action';

export default async function OrdersPage() {
  const [ordersResponse, revenueResponse] = await Promise.all([
    getOrders(),
    getRevenue(),
  ]);

  if (!ordersResponse.success) {
    return <OrderError error={ordersResponse.error as string} />;
  }

  if (!revenueResponse.success) {
    return <OrderError error={revenueResponse.error as string} />;
  }

  return (
    <div className='space-y-8'>
      <Suspense fallback={'Loading Metrics'}>
        <OrdersMatrix />
      </Suspense>
      <Suspense fallback={'Laoding Revenue Charts'}>
        <RevenueChart data={revenueResponse.data} />
      </Suspense>
      <Card className='shadow-none flex-1 overflow-hidden border-[0.1px] bg-[#0a0a0a]'>
        <CardHeader>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-4'>
              <Suspense fallback={<div>Loading search...</div>}>
                <Search />
              </Suspense>
              <Suspense fallback={'loading'}>
                <OrderPaymentMethodFilter />
              </Suspense>
              <Suspense fallback='loading...'>
                <OrderCashierFilter />
              </Suspense>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='block lg:hidden'></div>
          <div className='hidden lg:block'>
            <Suspense fallback={<div>Loading orders...</div>}>
              <OrdersTable orders={ordersResponse.data} />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
