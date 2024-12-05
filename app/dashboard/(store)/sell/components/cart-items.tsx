'use client';

import { Button } from '@/components/ui/button';
import { Delete, Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCartStore } from '../hooks/use-cart-store';
import { CartItem as CartItemType } from '../hooks/use-cart-store';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantityDebounced, removeItem } = useCartStore();
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    updateQuantityDebounced(item.product.id, newQuantity);
  };

  return (
    <div
      key={item.product.id}
      className='rounded-lg space-y-2 bg-muted/20 border-[0.1px] p-3 mb-3 transition-all duration-300'
    >
      <div className='flex items-center justify-between '>
        <h4 className='text-sm truncate max-w-[60%]'>{item.product.name}</h4>
        <p
          className='font-medium text-xs text-destructive ml-2 cursor-pointer hover:text-red-600'
          onClick={() => removeItem(item.product.id)}
        >
          <Delete strokeWidth={1} />
        </p>
      </div>
      <div className='flex items-center justify-between text-muted-foreground'>
        <div className='flex items-center  text-sm  font-medium'>
          <p> {item.product.sellingPrice}</p> <span className='mx-1'>x</span>
          <p>{item.quantity}</p>
        </div>

        <div className='flex items-center space-x-1 border rounded-full px-1 py-0.5'>
          <Button
            size='icon'
            variant='outline'
            className='rounded-full h-6 w-6'
            onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
          >
            <Minus className='h-3 w-3' />
          </Button>
          <span className='w-6 text-center  text-primary text-sm'>
            {item.quantity}
          </span>
          <Button
            size='icon'
            variant='outline'
            className='rounded-full h-6 w-6 '
            disabled={item.quantity >= item.product.quantityInStock}
            onClick={() =>
              handleQuantityChange(
                Math.min(item.product.quantityInStock, quantity + 1)
              )
            }
          >
            <Plus className='h-3 w-3 text-white' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
