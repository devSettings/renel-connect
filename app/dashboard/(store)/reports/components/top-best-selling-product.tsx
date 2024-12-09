'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, Cell } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type Product = {
  name: string;
  revenue: number;
};

interface Props {
  data: Product[];
}

export function TopBestSellingProducts({ data }: Props) {
  const chartConfig = {
    revenue: {
      label: 'Revenue',
    },
  } satisfies ChartConfig;

  const stunningColors = [
    '#FF5733', // Red
    '#3357FF', // Blue
    '#FF33A1', // Pink
    '#A133FF', // Purple
    '#FFC300', // Yellow
  ];

  return (
    <Card className='border-[0.1px]'>
      <CardHeader>
        <CardTitle>Top 5 Best Selling Products</CardTitle>
        <CardDescription>Displaying product revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='name'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='revenue' strokeWidth={2} radius={8}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={stunningColors[index % stunningColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing revenue for the top 5 products
        </div>
      </CardFooter>
    </Card>
  );
}
