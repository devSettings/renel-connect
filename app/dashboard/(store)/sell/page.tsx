import Search from '@/components/search';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Suspense } from 'react';
import getItems from './actions/get-items';
import Cart from './components/cart';
import ProductGrid from './components/product-grid';
import ProductLoading from './components/product-loading';
import Refresh from './components/refresh';
import CartItemLaoding from './components/cart-loading';

interface Props {
  searchParams: Promise<{ searchQuery: string }>;
}

interface ProductSectionProps {
  searchQuery?: string;
}

const ProductSection = async ({ searchQuery }: ProductSectionProps) => {
  const reponse = await getItems({ search: searchQuery, pageSize: 25 });

  if (!reponse.success) return '';

  return <ProductGrid products={reponse.data} />;
};

const PosPage = async ({ searchParams }: Props) => {
  const query = (await searchParams).searchQuery;

  return (
    <div className='container mx-auto h-full'>
      <div className='grid grid-cols-[1fr_auto] gap-4'>
        <div className='space-y-6 rounded-lg h-full p-4 border-[0.1px] bg-card shadow-sm'>
          <div className='flex items-center gap-2'>
            <div className='flex-1'>
              <Suspense fallback={<div>Loading search...</div>}>
                <Search />
              </Suspense>
            </div>
            <div>
              <Refresh />
            </div>
          </div>
          <Suspense fallback={<ProductLoading />}>
            <ScrollArea className='h-[70vh]'>
              <ProductSection searchQuery={query} />
            </ScrollArea>
          </Suspense>
        </div>
        <div className='space-y-6 w-[20rem] min-h-[80vh]   rounded-lg p-4 bg-card border-[0.1px]'>
          <Cart cashier={'j'} />
        </div>
      </div>
    </div>
  );
};

export default PosPage;
