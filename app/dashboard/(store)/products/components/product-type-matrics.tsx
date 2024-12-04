'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

interface Props {
  inventory: number;
  service: number;
  nonInventory: number;
  digital: number;
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
  inventory: {
    label: 'Inventory',
    color: 'hsl(var(--chart-1))',
  },
  service: {
    label: 'Service',
    color: 'hsl(var(--chart-2))',
  },
  nonInventory: {
    label: 'Non Inventory',
    color: 'hsl(var(--chart-3))',
  },
  digital: {
    label: 'Digital',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function ProductTypeMetrics({
  inventory,
  service,
  nonInventory,
  digital,
}: Props) {
  const chartData = [
    { type: 'inventory', products: inventory, fill: 'var(--color-inventory)' },
    { type: 'service', products: service, fill: 'var(--color-service)' },
    {
      type: 'nonInventory',
      products: nonInventory,
      fill: 'var(--color-non-inventory)',
    },
    { type: 'digital', products: digital, fill: 'var(--color-digital)' },
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
              nameKey='type'
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
