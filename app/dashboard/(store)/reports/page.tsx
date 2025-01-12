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
import { format } from 'date-fns';

interface ReportPageProps {
  searchParams: {
    date?: string;
  };
}

export default async function ReportPage({ searchParams }: ReportPageProps) {
  const currentDateRange = `${format(
    new Date(new Date().setHours(new Date().getHours() - 6)),
    'yyyy-MM-dd'
  )}x${format(
    new Date(new Date().setHours(new Date().getHours() - 6)),
    'yyyy-MM-dd'
  )}`;

  const dateRange = searchParams.date || currentDateRange;
  const [startDate, endDate] = dateRange.split('x');

  const [salesResponse, itemsResponse] = await Promise.all([
    getSales({ date: { start: startDate, end: endDate } }),
    getSaleItems({ date: { start: startDate, end: endDate } }),
  ]);

  if (!salesResponse.success) {
    return null;
  }

  if (!itemsResponse.success) return;

  const topSellingProductResponse = await getTopSellingProduct();
  if (!topSellingProductResponse.success) return;

  const saleCategory = await getSaleByCategory();

  if (!saleCategory.success) return null;

  return (
    <div className='space-y-4'>
      <Suspense fallback={'Loading Metrics'}>
        <ReportMetrics date={{ start: startDate, end: endDate }} />
      </Suspense>

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
