'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

interface Props {
  draft: number;
  active: number;
  inactive: number;
  archived: number;
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
  products: {
    label: 'Products',
  },
  draft: {
    label: 'Draft',
    color: 'hsl(var(--chart-1))',
  },
  active: {
    label: 'Active',
    color: 'hsl(var(--chart-2))',
  },
  inactive: {
    label: 'Inactive',
    color: 'hsl(var(--chart-3))',
  },
  archived: {
    label: 'Archived',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function ProductStatusMetrics({
  draft,
  active,
  inactive,
  archived,
}: Props) {
  const chartData = [
    { status: 'draft', products: draft, fill: 'var(--color-draft)' },
    { status: 'active', products: active, fill: 'var(--color-active)' },
    { status: 'inactive', products: inactive, fill: 'var(--color-inactive)' },
    { status: 'archived', products: archived, fill: 'var(--color-archived)' },
  ];

  const totalProducts = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.products, 0);
  }, []);

  return (
    <Card className='flex flex-col border-[0.1px]'>
      <CardContent className='flex-1 p-0 pb-0'>
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
              dataKey='products'
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
                          {totalProducts.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Products
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
