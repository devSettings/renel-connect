import { ScrollArea } from '@/components/ui/scroll-area';
import { notFound } from 'next/navigation';
import getProductById from './actions/get-product-by-id';
import UniqueProductMetrics from './components/unique-product-metrics';
import { ProductAnaliticsChart } from './components/product-analitics-chart';
import ProductSalesOverview from './components/product-sales-overview';
interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductAnalytics({ params }: Props) {
  const { id } = await params;
  const reponse = await getProductById(id);
  if (!reponse?.success) return notFound();

  return (
    <div className='flex flex-col'>
      <ScrollArea className='h-[90vh] overflow-hidden '>
        <div className='space-y-10'>
          <UniqueProductMetrics id={id} />
          <ProductAnaliticsChart />

          <ProductSalesOverview id={id} />
        </div>
      </ScrollArea>
    </div>
  );
}
