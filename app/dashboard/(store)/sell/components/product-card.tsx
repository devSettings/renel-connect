'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { PlusIcon } from 'lucide-react';
import { useCartStore } from '../hooks/use-cart-store';
import { Product } from '../types/product';

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const { items, addItem } = useCartStore();
  const currentQuantityInCart =
    items.find((item) => item.product.id === product.id)?.quantity || 0;

  const isMaxQuantityReached = currentQuantityInCart >= product.quantityInStock;

  return (
    <Card className=' border-[0.1px] shadow-none transition-all duration-300'>
      <CardContent className='p-4'>
        <div className='flex flex-col h-full'>
          <h2 className='text-sm font-medium mb-2  line-clamp-1'>
            {product.name}
          </h2>
          <p className='text-muted-foreground text-xs mb-2 font-medium'>
            {product.category}
          </p>
          <div className='flex justify-between items-center mt-auto'>
            <p className='text-sm font-bold text-blue-700'>
              {product.sellingPrice}
              <span className='font-semibold text-xs ml-1'>GDS</span>
            </p>
            <Button
              variant={'outline'}
              disabled={product.quantityInStock === 0 || isMaxQuantityReached}
              className={cn(
                'rounded-full w-10 h-10 p-0 bg-[#0a0a0a] border-blue-700 shadow-none border transition-all duration-300 text-white ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 hover:bg-tra hover:border-blue-600  shrink-0'
              )}
              onClick={() => addItem(product)}
            >
              <PlusIcon strokeWidth={0.5} className='w-6 h-6' />
              <span className='sr-only'>Add to Order</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
