'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

interface Props {
  room: number;
  drink: number;
  food: number;
  other: number;
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
  room: {
    label: 'Room',
    color: 'hsl(var(--chart-1))',
  },
  drink: {
    label: 'Drink',
    color: 'hsl(var(--chart-2))',
  },
  food: {
    label: 'Food',
    color: 'hsl(var(--chart-3))',
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function ProductDepartmentMetrics({ room, drink, food, other }: Props) {
  const chartData = [
    { department: 'room', products: room, fill: 'var(--color-room)' },
    { department: 'drink', products: drink, fill: 'var(--color-drink)' },
    { department: 'food', products: food, fill: 'var(--color-food)' },
    { department: 'other', products: other, fill: 'var(--color-other)' },
  ];

  const totalProducts = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.products, 0);
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
              dataKey='products'
              nameKey='department'
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
