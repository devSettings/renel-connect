import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BadgeDollarSign, Coins, Contact, Package } from 'lucide-react';
import getReportMetrics from '../actions/get-report-metrics';

interface ReportMetric {
  title: string;
  count: number;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  badge: string;
}

export default async function ReportMetrics() {
  const reponse = await getReportMetrics();
  if (!reponse.success) {
    return null;
  }

  const { totalNewCustomers, totalSales, averageSaleValue, totalIncome } =
    reponse.data;

  const metrics: ReportMetric[] = [
    {
      title: 'Total Vente',
      count: totalSales,
      icon: <Package className='h-5 w-5' />,
      gradientFrom: 'from-blue-700',
      gradientTo: 'to-blue-400',
      badge:
        ' text-blue-600 border-blue-500/50 hover:bg-blue-500/30 hover:border-blue-400',
    },
    {
      title: 'Total Revenu',
      count: totalIncome,
      icon: <BadgeDollarSign className='h-5 w-5' />,
      gradientFrom: 'from-blue-700',
      gradientTo: 'to-blue-400',
      badge:
        ' text-emerald-600 border-emerald-500/50 hover: hover:border-emerald-400',
    },

    {
      title: 'Moyenne de vente',
      count: averageSaleValue,
      icon: <Coins className='h-5 w-5' />,
      gradientFrom: 'from-red-700',
      gradientTo: 'to-red-400',
      badge:
        ' text-purple-600 border-purle-500/50 hover: hover:border-purle-400',
    },
    {
      title: 'Nouveaux clients',
      count: totalNewCustomers,
      icon: <Contact className='h-5 w-5' />,
      gradientFrom: 'from-yellow-700',
      gradientTo: 'to-yellow-400',
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
          className='border-[0.1px]  shadow-none'
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

            {/* <div className='flex justify-between text-xs '>
              <span>{totalProducts.toLocaleString()} total</span>
              <span>{((metric.count / totalProducts) * 100).toFixed(1)}%</span>
            </div> */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
