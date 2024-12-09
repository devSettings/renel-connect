'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

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

const stunningColors = [
  '#FF5733', // Red
  '#3357FF', // Blue
  '#FF33A1', // Pink
  '#A133FF', // Purple
  '#FFC300', // Yellow
];

const chartConfig = {
  revenue: {
    label: 'Revenue',
  },
  chrome: {
    label: 'Food',
    color: stunningColors[0],
  },
  drink: {
    label: 'Drink',
    color: stunningColors[1],
  },
  other: {
    label: 'Other',
    color: stunningColors[2],
  },
  room: {
    label: 'Room',
    color: stunningColors[3],
  },
} satisfies ChartConfig;

interface Props {
  food: number;
  drink: number;
  room: number;
  other: number;
}

export function SaleCategoryChart({ food, drink, other, room }: Props) {
  const chartData = [
    { browser: 'food', revenue: food, fill: stunningColors[0] },
    { browser: 'drink', revenue: drink, fill: stunningColors[1] },
    { browser: 'other', revenue: other, fill: stunningColors[2] },
    { browser: 'room', revenue: room, fill: stunningColors[3] },
  ];

  const totalrevenue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [chartData]);

  return (
    <Card className='flex flex-col border-[0.1px]'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='revenue'
              nameKey='browser'
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalrevenue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Revenue
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing total revenue for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
