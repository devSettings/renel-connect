import { ScrollArea } from '@/components/ui/scroll-area';
import { notFound } from 'next/navigation';
import getProductById from './actions/get-product-by-id';
import getProductRevenue from './actions/get-product-revenue';
import { ProductAnaliticsChart } from './components/product-analitics-chart';
import ProductSalesOverview from './components/product-sales-overview';
import UniqueProductMetrics from './components/unique-product-metrics';
interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductAnalytics({ params }: Props) {
  const { id } = await params;
  const reponse = await getProductById(id);
  if (!reponse?.success) return notFound();
  const revenueResponse = await getProductRevenue({ id });
  if (!revenueResponse?.success) return notFound();
  const { data } = revenueResponse;

  return (
    <div className='flex flex-col'>
      <ScrollArea className='h-[90vh] overflow-hidden '>
        <div className='space-y-10'>
          <UniqueProductMetrics id={id} />
          <ProductAnaliticsChart data={data} />
          <ProductSalesOverview id={id} />
        </div>
      </ScrollArea>
    </div>
  );
}
