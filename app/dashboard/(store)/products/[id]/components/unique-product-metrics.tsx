import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BadgeX, Coins, Currency, HandCoins, LucideIcon } from 'lucide-react';
import getUniqueProductMetrics from '../actions/get-unique-product-metrics';

interface Props {
  id: string;
}

type TransactionMetric = {
  title: string;
  count: number;
  icon: LucideIcon;
  iconColor: string;
};

const UniqueProductMetrics = async ({ id }: Props) => {
  const response = await getUniqueProductMetrics(id);
  if (!response.success) return <p>{response.error as string}</p>;

  const metrics: TransactionMetric[] = [
    {
      title: 'Income',
      count: 0,
      icon: HandCoins,
      iconColor: 'text-blue-800',
    },
    {
      title: 'Expense',
      count: 0,
      icon: Currency,
      iconColor: '',
    },
    {
      title: 'Aquisition',
      count: 0,
      icon: BadgeX,
      iconColor: '',
    },
    {
      title: 'Lost',
      count: 0,
      icon: Coins,
      iconColor: '',
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
                'p-2 text-xs font-medium  transition-colors duration-200 shadow-lg rounded-sm'
              )}
            >
              <metric.icon className={cn('w-5 h-5', metric.iconColor)} />
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
};

export default UniqueProductMetrics;
