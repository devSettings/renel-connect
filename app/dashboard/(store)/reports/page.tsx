import Search from '@/components/search';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Suspense } from 'react';
import ReportMetrics from './components/report-metrics';
import { SaleCategoryChart } from './components/sale-category-chart';
import { TopBestSellingPrducts } from './components/top-best-selling-product';
import SaleReportTable from './components/sale-report-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SaleReportItemTable from './components/sale-items-report-table';
import getSales from './actions/get-sales';
import getSaleItems from './actions/get-sale-items';

export default async function ReportPage() {
  const [salesResponse, itemsResponse] = await Promise.all([
    getSales(),
    getSaleItems(),
  ]);

  if (!salesResponse.success) {
    return null;
  }

  if (!itemsResponse.success) return;

  //   if (!revenueResponse.success) {
  //     return <OrderError error={revenueResponse.error as string} />;
  //   }

  return (
    <div className='space-y-8'>
      <Suspense fallback={'Loading Metrics'}>
        <ReportMetrics />
      </Suspense>
      <div className='grid grid-cols-2 gap-4'>
        <Suspense>
          <TopBestSellingPrducts />
        </Suspense>
        <Suspense fallback={'Laoding Revenue Charts'}>
          <SaleCategoryChart />
        </Suspense>
      </div>

      <Tabs defaultValue='Sales'>
        <TabsList>
          <TabsTrigger value='Sales'>Sale Report</TabsTrigger>
          <TabsTrigger value='Items'>Sale Items Report</TabsTrigger>
        </TabsList>
        <TabsContent value='Sales'>
          <Card className='shadow-none flex-1 overflow-hidden border-[0.1px] bg-[#0a0a0a]'>
            <CardHeader>
              <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-4'>
                  <Suspense fallback={<div>Loading search...</div>}>
                    <Search />
                  </Suspense>
                  {/* <OrderPaymentMethodFilter /> */}
                  {/* <OrderCashierFilter /> */}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='block lg:hidden'>
                {/* TODO: Implement mobile view */}
              </div>
              <div className='hidden lg:block'>
                <Suspense fallback={<div>Loading orders...</div>}>
                  <SaleReportTable sales={salesResponse.data} />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='Items'>
          <Card className='shadow-none flex-1 overflow-hidden border-[0.1px] bg-[#0a0a0a]'>
            <CardHeader>
              <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-4'>
                  <Suspense fallback={<div>Loading search...</div>}>
                    <Search />
                  </Suspense>
                  {/* <OrderPaymentMethodFilter /> */}
                  {/* <OrderCashierFilter /> */}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='block lg:hidden'>
                {/* TODO: Implement mobile view */}
              </div>
              <div className='hidden lg:block'>
                <Suspense fallback={<div>Loading orders...</div>}>
                  <SaleReportItemTable items={itemsResponse.data} />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
