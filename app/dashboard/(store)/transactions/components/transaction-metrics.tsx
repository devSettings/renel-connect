import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BadgeX, Coins, Currency, HandCoins } from 'lucide-react';
import getTransactionMetrics from '../actions/get-transaction-matrics';

interface TransactionMetric {
  title: string;
  count: number;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  badge: string;
}

export default async function TransactionsMetrics() {
  const reponse = await getTransactionMetrics();
  if (!reponse.success) {
    return <p className='text-red'>error fetching...</p>;
  }

  const metrics: TransactionMetric[] = [
    {
      title: 'Income',
      count: reponse.data.income,
      icon: <HandCoins className='h-5 w-5' />,
      gradientFrom: 'from-blue-700',
      gradientTo: 'to-blue-400',
      badge:
        ' text-emerald-600 border-emerald-500/50 hover: hover:border-emerald-400',
    },
    {
      title: 'Expense',
      count: reponse.data.expenses,
      icon: <Currency className='h-5 w-5' />,
      gradientFrom: 'from-yellow-700',
      gradientTo: 'to-yellow-400',
      badge:
        'text-yellow-600 border-yellow-500/50 hover:bg-yellow-500/30 hover:border-yellow-400',
    },
    {
      title: 'Aquisition',
      count: reponse.data.aquisitions,
      icon: <BadgeX className='h-5 w-5' />,
      gradientFrom: 'from-blue-700',
      gradientTo: 'to-blue-400',
      badge:
        ' text-blue-600 border-blue-500/50 hover:bg-blue-500/30 hover:border-blue-400',
    },
    {
      title: 'Lost',
      count: reponse.data.loses,
      icon: <Coins className='h-5 w-5' />,
      gradientFrom: 'from-red-700',
      gradientTo: 'to-red-400',
      badge: ' text-red-600 border-red-500/50 hover: hover:border-red-400',
    },
  ];

  return (
    <div className='grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {metrics.map((metric, index) => (
        <Card key={index} className='border-[0.1px]  shadow-none'>
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
