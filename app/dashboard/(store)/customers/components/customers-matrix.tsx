import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Box, CogIcon, Package2, ShoppingCart } from 'lucide-react';
// import getProductSummary from '../actions/get-product-summary';
import { FaUserAlt } from 'react-icons/fa';

interface ProductMetric {
  title: string;
  count: number;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  badge: string;
}

export default async function CustomersMatrix() {
  //   const reponse = await getProductSummary();
  //   if (!reponse.success) {
  //     return <p className='text-red'>error fetching...</p>;
  //   }

  const metrics: ProductMetric[] = [
    {
      title: 'Customers',
      count: 100,
      icon: <FaUserAlt className='h-4 w-4' />,
      gradientFrom: 'from-blue-700',
      gradientTo: 'to-blue-400',
      badge:
        'bg-blue-500/30 text-blue-600 border-blue-500/50 hover:bg-blue-500/30 hover:border-blue-400',
    },
    {
      title: 'Active',
      count: 80,
      icon: <Box className='h-4 w-4' />,
      gradientFrom: 'from-blue-700',
      gradientTo: 'to-blue-400',
      badge:
        'bg-emerald-500/30 text-emerald-600 border-emerald-500/50 hover:bg-emerald-500/30 hover:border-emerald-400',
    },
    {
      title: 'Inactive',
      count: 18,
      icon: <Package2 className='h-4 w-4' />,
      gradientFrom: 'from-yellow-700',
      gradientTo: 'to-yellow-400',
      badge:
        'bg-yellow-500/20 text-yellow-600 border-yellow-500/50 hover:bg-yellow-500/30 hover:border-yellow-400',
    },
    {
      title: 'Banned',
      count: 2,
      icon: <CogIcon className='h-4 w-4' />,
      gradientFrom: 'from-red-700',
      gradientTo: 'to-red-400',
      badge:
        'bg-red-500/30 text-red-600 border-red-500/50 hover:bg-red-500/30 hover:border-red-400',
    },
  ];

  const totalProducts = metrics[0].count;

  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {metrics.map((metric, index) => (
        <Card key={index} className='bg-accent/20 border-[0.1px] shadow-none'>
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
            {/* <div className='h-2 mb-2 bg-white dark:bg-gray-800 rounded-full overflow-hidden'>
              <div
                className={`h-full bg-gradient-to-r ${metric.gradientFrom} ${metric.gradientTo}`}
                style={{ width: `${(metric.count / totalProducts) * 100}%` }}
              />
            </div> */}
            <div className='flex justify-between text-xs '>
              <span>{totalProducts.toLocaleString()} total</span>
              <span>{((metric.count / totalProducts) * 100).toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
