import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Banknote, Calendar, Mail, MapPin, Phone, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import BarCode from './bar-code';
import ItemsList, { Item } from './item-list';
import ThankYouMessage from './thank-you-message';
import { FaPrint } from 'react-icons/fa';
import { PaymentMethod } from '@prisma/client';

interface BarReceiptProps {
  transactionId: string;
  cashier: string;
  items: Item[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountReceived: number;
  change: number;
  paymentMethod: PaymentMethod;
}

const BarReceipt = ({
  transactionId,
  cashier,
  items,
  subtotal,
  discount,
  tax,
  total,
  amountReceived,
  change,
  paymentMethod,
}: BarReceiptProps) => {
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
    <div>
      <Card
        className='p-4 space-y-4 w-[80mm] border-none shadow-none screen-only print:block print-only'
        ref={contentRef}
      >
        <div className='text-center mb-2'>
          <h1 className='text-2xl font-black'>La Pause Inn</h1>
        </div>
        <div className='space-y-1 text-xs mb-4'>
          <p className='flex items-center justify-center'>
            <MapPin className='w-3 h-3 mr-1 ' />
            #54 Rue Jacques 1er , Delmas 31
          </p>
          <p className='flex items-center justify-center'>
            <Phone className='w-3 h-3 mr-1 ' />
            +509 3704 0400
          </p>
          <p className='flex items-center justify-center'>
            <Mail className='w-3 h-3 mr-1 ' />
            lapauseinn@gmail.com
          </p>
        </div>
        <div className='border-t  my-2'></div>
        <div className='space-y-2 text-xs mb-4'>
          <div className='flex justify-between items-center'>
            <span className='font-medium'>Transaction ID:</span>
            <span>{transactionId}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='font-medium flex items-center'>
              <Calendar className='w-3 h-3 mr-1 text-gray-400' />
              Date:
            </span>
            <span>{new Date().toLocaleDateString('fr-FR')}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='font-medium flex items-center'>
              <User className='w-3 h-3 mr-1 ' />
              Cashier:
            </span>
            <span>{cashier}</span>
          </div>
        </div>
        <div className='border-t  my-2'></div>
        <ItemsList data={items} />
        <div className='border-t  my-2'></div>
        <div className='space-y-1 text-xs  mb-3'>
          <div className='flex justify-between'>
            <span>Subtotal:</span>
            <span>{subtotal} G</span>
          </div>
          <div className='flex justify-between'>
            <span className='flex items-center'>Discount:</span>
            <span>-{discount}G</span>
          </div>
          <div className='flex justify-between'>
            <span>Tax:</span>
            <span>{tax} G</span>
          </div>
          <div className='flex justify-between font-bold text-sm mt-2'>
            <span>Total:</span>
            <span>{total} G</span>
          </div>
        </div>
        <div className='mt-4 space-y-1 text-xs'>
          <Separator />
          <div className='flex justify-between'>
            <span className='flex items-center'>Received:</span>
            <span>{amountReceived} G</span>
          </div>
          <div className='flex justify-between'>
            <span>Change:</span>
            <span>{change} G</span>
          </div>
        </div>
        <div className='mt-6 text-center'>
          <Banknote className='w-6 h-6 mx-auto  mb-1' />
          <p className='text-xs'>
            Paid with {paymentMethod === 'CASH' && 'Cash'}{' '}
            {paymentMethod === 'CREDIT_CARD' && 'Card'}
            {paymentMethod === 'CHECK' && 'Check'}
            {paymentMethod === 'WIRE_TRANSFER' && 'Wire Transfer'}
          </p>
        </div>
        <div className='border-t  my-2'></div>
        <ThankYouMessage />
        <BarCode transactionId={transactionId} />
      </Card>
      <Button
        className=' bg-blue-700 hover:bg-blue-900 text-white w-full'
        onClick={() => reactToPrintFn()}
      >
        <FaPrint className='w-4 h-4 mr-2' />
        Print receipt
      </Button>
    </div>
  );
};

export default BarReceipt;
