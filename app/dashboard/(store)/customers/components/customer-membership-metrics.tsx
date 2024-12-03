'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

interface Props {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
}

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  customers: {
    label: 'Customers',
  },
  bronze: {
    label: 'Bronze',
    color: 'hsl(var(--chart-1))',
  },
  silver: {
    label: 'Silver',
    color: 'hsl(var(--chart-2))',
  },
  gold: {
    label: 'Gold',
    color: 'hsl(var(--chart-3))',
  },
  platinum: {
    label: 'Platinum',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function CustomerMembershipMetrics({
  bronze,
  silver,
  gold,
  platinum,
}: Props) {
  const chartData = [
    { status: 'bronze', customers: bronze, fill: 'var(--color-bronze)' },
    { status: 'silver', customers: silver, fill: 'var(--color-silver)' },
    { status: 'gold', customers: gold, fill: 'var(--color-gold)' },
    {
      status: 'platinum',
      customers: platinum,
      fill: 'var(--color-platinum)',
    },
  ];

  const totalCustomers = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.customers, 0);
  }, []);

  return (
    <Card className='flex flex-col border-[0.1px]'>
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
              dataKey='customers'
              nameKey='status'
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
                          {totalCustomers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Customers
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
