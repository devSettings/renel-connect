'use client';

import { ItemReport } from '@/app/dashboard/(store)/reports/types/report';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from './ui/button';
import { FaPrint } from 'react-icons/fa';
import { format } from 'date-fns';

const currentDate = format(
  new Date(new Date().setHours(new Date().getHours() - 6)),
  'yyyy-MM-dd'
);

interface SalesItemsReceiptProps {
  items: ItemReport[];
}

const SalesItemsReceipt = ({ items }: SalesItemsReceiptProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  const reactToPrintFn = useReactToPrint({
    contentRef,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className=''>
      <div
        ref={contentRef}
        className='px-7 py-4 space-y-4 w-[80mm] h-auto border-none shadow-none screen-only print:block print-only'
      >
        <div className='text-center border-b border-dashed border-gray-400 pb-2 mb-2'>
          <div className='font-bold'>Sale Item Receipt</div>
          <div>{currentDate}</div>
        </div>

        <div className='border-b border-dashed border-gray-400 pb-2 mb-2'>
          <div className='flex justify-between'>
            <span className='w-1/2'>Item</span>
            <span className='w-1/6 text-right'>Qty</span>
            <span className='w-1/3 text-right'>Revenue</span>
          </div>
          {items.map((item) => (
            <div
              key={item.id}
              className='flex justify-between'
            >
              <span className='w-1/2 truncate text-black'>{item.name}</span>
              <span className='w-1/6 text-right text-black'>
                {item.quantitySold}
              </span>
              <span className='w-1/3 text-right text-black'>
                ${item.totalRevenue.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className='text-center text-xs text-black'>
          *** End of Sale Report ***
        </div>
      </div>

      <Button
        variant={'secondary'}
        className='w-full'
        onClick={() => reactToPrintFn()}
      >
        <FaPrint className='w-4 h-4 mr-2' />
        Print receipt
      </Button>
    </div>
  );
};

export default SalesItemsReceipt;
