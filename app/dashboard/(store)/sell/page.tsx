import Search from '@/components/search';
import { Suspense } from 'react';
import ProductGrid from './components/product-grid';
import Refresh from './components/refresh';
import ProductLoading from './components/product-loading';
import Cart from './components/cart';
import getItems from './actions/get-items';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

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

  const ff = await getItems();

  if (!ff.success) {
    // toast.error(ff.error);
    console.log(ff.error);
  }

  // console.log('hhe');

  return (
    <div className='container mx-auto h-full'>
      <div className='grid grid-cols-[1fr_auto] gap-4'>
        <div className='space-y-6 rounded-lg h-full p-4 border-[0.1px] bg-[#0a0a0a] shadow-sm'>
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
              {/* <ProductLoading /> */}
            </ScrollArea>
          </Suspense>
        </div>
        <div className='space-y-6 w-[20rem] min-h-[80vh]   rounded-lg p-4 bg-[#0a0a0a] border-[0.1px]'>
          <Cart cashier={'j'} />
        </div>
      </div>
    </div>
  );
};

export default PosPage;
