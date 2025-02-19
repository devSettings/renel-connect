import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BadgeDollarSign, Coins, Contact, Package } from 'lucide-react';
import { returnMetrics } from './action';

interface OrderMetric {
  title: string;
  count: number;
  icon: React.ReactNode;
  badge: string;
}

export default async function ReturnMetrics() {
  const count = await returnMetrics();
  const metrics: OrderMetric[] = [
    {
      title: 'Total Return',
      count: count?.totalReturnRequest || 0,
      icon: <Package className='h-5 w-5' />,

      badge:
        ' text-blue-600 border-blue-500/50 hover:bg-blue-500/30 hover:border-blue-400',
    },
    {
      title: 'Pending Returns',
      count: count?.pendingReturns || 0,
      icon: <BadgeDollarSign className='h-5 w-5' />,

      badge:
        ' text-emerald-600 border-emerald-500/50 hover: hover:border-emerald-400',
    },

    {
      title: 'Approved Returns',
      count: count.approvedReturns || 0,
      icon: <Contact className='h-5 w-5' />,

      badge:
        ' text-purple-600 border-purle-500/50 hover: hover:border-purle-400',
    },
    {
      title: 'Rejected Returns',
      count: count.rejectedReturns || 0,
      icon: <Coins className='h-5 w-5' />,

      badge:
        'text-yellow-600 border-yellow-500/50 hover:bg-yellow-500/30 hover:border-yellow-400',
    },
  ];

  const totalProducts = metrics[0].count;

  return (
    <div className='grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className='bg-[#0a0a0a] border-[0.1px]  shadow-none'
        >
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-medium'>
              {metric.title}
            </CardTitle>
            <div
              className={cn(
                'p-2 text-xs font-medium  transition-colors duration-200 shadow-lg rounded-sm',
                metric.badge
              )}
            >
              {metric.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold mb-2'>
              {metric.count.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
