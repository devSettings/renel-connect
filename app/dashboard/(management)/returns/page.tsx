import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Suspense } from 'react';
import ReturnMetrics from './return-metrics';
import ReturnTable from './returns-table';
import Search from '@/components/search';
import { getRefundRequest } from './action';

export default async function ReturnsPage() {
  const allreturn = await getRefundRequest();

  return (
    <div className='space-y-8'>
      <Suspense fallback={'Loading Metrics'}>
        <ReturnMetrics />
      </Suspense>

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
          <div className='block lg:hidden'></div>
          <div className='hidden lg:block'>
            <Suspense fallback={<div>Loading orders...</div>}>
              <ReturnTable orders={allreturn} />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
