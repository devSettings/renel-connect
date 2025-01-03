import Search from '@/components/search';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suspense } from 'react';
import getReportMetrics from './actions/get-report-metrics';
import getSaleByCategory from './actions/get-sale-by-category';
import getSaleItems from './actions/get-sale-items';
import getSales from './actions/get-sales';
import getTopSellingProduct from './actions/top-selling-product';
import ReportMetrics from './components/report-metrics';
import { SaleCategoryChart } from './components/sale-category-chart';
import SaleReportItemTable from './components/sale-items-report-table';
import SaleReportTable from './components/sale-report-table';
import { TopBestSellingProducts } from './components/top-best-selling-product';

interface ReportPageProps {
  searchParams: {
    date: string;
  };
}

export default async function ReportPage({ searchParams }: ReportPageProps) {
  const [salesResponse, itemsResponse] = await Promise.all([
    getSales(),
    getSaleItems(),
  ]);

  console.log(searchParams);

  if (!salesResponse.success) {
    return null;
  }

  if (!itemsResponse.success) return;

  //   if (!revenueResponse.success) {
  //     return <OrderError error={revenueResponse.error as string} />;
  //   }

  const topSellingProductResponse = await getTopSellingProduct();
  if (!topSellingProductResponse.success) return;

  const reponse = await getReportMetrics();
  if (!reponse.success) {
    return null;
  }

  const { totalNewCustomers, totalSales, averageSaleValue, totalIncome } =
    reponse.data;
  const saleCategory = await getSaleByCategory();

  if (!saleCategory.success) return null;

  return (
    <div className='space-y-8'>
      <Suspense fallback={'Loading Metrics'}>
        <ReportMetrics />
      </Suspense>
      <div className='grid grid-cols-2 gap-4'>
        <Suspense>
          <TopBestSellingProducts data={topSellingProductResponse.data} />
        </Suspense>
        <Suspense fallback={'Laoding Revenue Charts'}>
          <SaleCategoryChart
            food={saleCategory.data.food}
            drink={saleCategory.data.drink}
            room={saleCategory.data.room}
            other={saleCategory.data.other}
          />
        </Suspense>
      </div>

      <Tabs defaultValue='Sales'>
        <TabsList>
          <TabsTrigger value='Sales'>Rapport de vente</TabsTrigger>
          <TabsTrigger value='Items'>Rapport d'articles vendus</TabsTrigger>
        </TabsList>
        <TabsContent value='Sales'>
          <Card className='shadow-none flex-1 overflow-hidden border-[0.1px] bg-[#0a0a0a]'>
            <CardHeader>
              <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-4'>
                  <Suspense fallback={<div>Loading search...</div>}>
                    <Search />
                  </Suspense>
                  {/* <Button
                    size='lg'
                    // className='gap-2 bg-blue-600 text-white'
                    variant='secondary'
                  >
                    <PrinterIcon className='w-4 h-4' />
                    Print report
                  </Button> */}
                  {/* <PosReceipt
                    topSellingItems={topSellingProductResponse.data}
                    summary={salesResponse.data}
                  /> */}
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
