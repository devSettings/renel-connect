import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Delete, Minus, Plus } from 'lucide-react';

const CartItemLaoding = () => {
  return (
    <div className='rounded-lg space-y-2  bg-muted/20 border-[0.1px] p-3 mb-3 transition-all duration-300 '>
      <div className='flex items-center justify-between '>
        <h4 className='text-sm truncate max-w-[60%]'>
          <Skeleton />
        </h4>
        <p
          aria-disabled={true}
          className='font-medium text-xs text-destructive ml-2 cursor-pointer hover:text-red-600'
        >
          <Delete strokeWidth={1} />
        </p>
      </div>
      <div className='flex items-center justify-between text-muted-foreground'>
        <div className='flex items-center  text-sm  font-medium'>
          <p>
            <Skeleton />
          </p>
          <span className='mx-1'>x</span>
          <p>
            <Skeleton />
          </p>
        </div>

        <div className='flex items-center space-x-1 border rounded-full px-1 py-0.5'>
          <Button
            size='icon'
            variant='outline'
            className='rounded-full h-6 w-6'
            disabled
          >
            <Minus className='h-3 w-3' />
          </Button>
          <span className='w-6 text-center  text-primary text-sm'>
            <Skeleton />
          </span>
          <Button
            size='icon'
            variant='outline'
            className='rounded-full h-6 w-6 '
            disabled
          >
            <Plus className='h-3 w-3 text-white' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItemLaoding;
