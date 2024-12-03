'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

interface Props {
  active: number;
  inactive: number;
  suspended: number;
  banned: number;
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
  active: {
    label: 'Active',
    color: 'hsl(var(--chart-1))',
  },
  inactive: {
    label: 'Inactive',
    color: 'hsl(var(--chart-2))',
  },
  suspended: {
    label: 'Suspended',
    color: 'hsl(var(--chart-3))',
  },
  banned: {
    label: 'Banned',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function CustomerStatusMetrics({
  active,
  inactive,
  banned,
  suspended,
}: Props) {
  const chartData = [
    { status: 'active', customers: active, fill: 'var(--color-active)' },
    { status: 'inactive', customers: inactive, fill: 'var(--color-inactive)' },
    {
      status: 'suspended',
      customers: suspended,
      fill: 'var(--color-suspended)',
    },
    { status: 'banned', customers: banned, fill: 'var(--color-banned)' },
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
