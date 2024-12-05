import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CreditCard,
  DollarSign,
  Package,
  Percent,
  PieChart,
  RefreshCw,
  Tag,
  TrendingUp,
} from 'lucide-react';
import React from 'react';
import getProductOverview from '../actions/get-product-overview';

interface Props {
  id: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
}

function MetricCard({ title, value, icon: Icon }: MetricCardProps) {
  return (
    <div className='border-[0.1px] p-4 rounded-lg'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='font-semibold text-gray-400'>{title}</h3>
        <Icon className='w-5 h-5 text-gray-500' />
      </div>
      <p className='text-2xl font-bold text-white'>{value}</p>
    </div>
  );
}

export default async function ProductSalesOverview({ id }: Props) {
  const response = await getProductOverview(id);
  if (!response.success) return <p>can not fetch</p>;

  return (
    <Card className='shadow-none border-[0.1px]'>
      <CardHeader>
        <CardTitle>Product Performance Metrics</CardTitle>
        <CardDescription>
          Key performance indicators for the product
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='profitability'>Profitability</TabsTrigger>
          </TabsList>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <MetricCard
                title='Avg. Cost Price'
                value={`${response.data.costPrice}`}
                icon={DollarSign}
              />
              <MetricCard
                title='Avg. Selling Price'
                value={`${response.data.sellingPrice}`}
                icon={Tag}
              />
              <MetricCard
                title='Avg. Gross Profit'
                value={`${response.data.unitGrossProfit}/Unit`}
                icon={TrendingUp}
              />
              <MetricCard
                title='Stock Value'
                value={`${response.data.stockValue.toLocaleString()}`}
                icon={Package}
              />
            </div>
          </TabsContent>
          <TabsContent value='profitability' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <MetricCard
                title='Profit Margin'
                value={`${response.data.profitMargin}%`}
                icon={Percent}
              />
              <MetricCard
                title='Avg. Transaction Value'
                value={`${response.data.averageTransactionValue}`}
                icon={CreditCard}
              />
              <MetricCard
                title='Stock Turnover'
                value={`${response.data.stockTurnOver}X`}
                icon={RefreshCw}
              />
              <MetricCard
                title='Sales Contribution '
                value={`${response.data.salesContribution}%`}
                icon={PieChart}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
