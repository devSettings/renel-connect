import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Banknote, Mail, MapPin, Phone, User } from 'lucide-react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import BarCode from './bar-code';
import ItemsList from './item-list';
import { receiptData } from './receipt-data';
import ThankYouMessage from './thank-you-message';

interface BarReceiptProps {
  address: string;
  phone1: string;
  email: string;
  transactionId: string;
  date: string;
  cashier: string;
  items: { name: string; price: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountReceived: number;
  change: number;
}

const BarReceipt = ({}: BarReceiptProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div className='flex justify-center items-center h-screen'>
      <Card className='p-4 space-y-4 w-[80mm]' ref={contentRef}>
        <div className='text-center mb-2'>
          <h1 className='text-2xl font-black text-black'>Pause Inn Bar</h1>
        </div>
        <div className='space-y-1 text-xs mb-4 text-gray-600'>
          <p className='flex items-center justify-center'>
            <MapPin className='w-3 h-3 mr-1 text-gray-400' />
            {receiptData.address}
          </p>
          <p className='flex items-center justify-center'>
            <Phone className='w-3 h-3 mr-1 text-gray-400' />
            {receiptData.phone1}
          </p>
          <p className='flex items-center justify-center'>
            <Mail className='w-3 h-3 mr-1 text-gray-400' />
            {receiptData.email}
          </p>
        </div>
        <div className='border-t border-gray-200 my-2'></div>
        <div className='space-y-2 text-xs mb-4 text-gray-600'>
          <div className='flex justify-between items-center'>
            <span className='font-medium'>ID de Transaction:</span>
            <span>{receiptData.transactionId}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='font-medium flex items-center'>
              <Calendar className='w-3 h-3 mr-1 text-gray-400' />
              Date:
            </span>
            <span>{receiptData.date}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='font-medium flex items-center'>
              <User className='w-3 h-3 mr-1 text-gray-400' />
              Caissier:
            </span>
            <span>{receiptData.cashier}</span>
          </div>
        </div>
        <div className='border-t border-gray-200 my-2'></div>
        {/* Uncomment and implement ItemsList when data is available */}
        <ItemsList data={[]} />
        <div className='border-t border-gray-200 my-2'></div>
        <div className='space-y-1 text-xs text-gray-900 mb-3'>
          <div className='flex justify-between'>
            <span>Sous-total:</span>
            <span>{receiptData.subtotal} G</span>
          </div>
          <div className='flex justify-between'>
            <span className='flex items-center'>discount:</span>
            <span>-{receiptData.discount}G</span>
          </div>
          <div className='flex justify-between'>
            <span>TVA:</span>
            <span>{receiptData.tax} G</span>
          </div>
          <div className='flex justify-between font-bold text-sm mt-2 text-black'>
            <span>Total:</span>
            <span>{receiptData.total} G</span>
          </div>
        </div>
        <div className='mt-4 space-y-1 text-xs text-gray-600'>
          <Separator />
          <div className='flex justify-between'>
            <span className='flex items-center'>Reçu:</span>
            <span>{receiptData.amountReceived} G</span>
          </div>
          <div className='flex justify-between'>
            <span>Monnaie:</span>
            <span>{receiptData.change} G</span>
          </div>
        </div>
        <div className='mt-6 text-center'>
          <Banknote className='w-6 h-6 mx-auto text-gray-400 mb-1' />
          <p className='text-xs text-gray-600'>
            Payé en {receiptData.paymentMethod}
          </p>
        </div>
        <div className='border-t border-gray-200 my-2'></div>
        <ThankYouMessage />
        <BarCode transactionId={receiptData.transactionId} />
      </Card>
      <Button className='mt-4' onClick={() => reactToPrintFn()}>
        Print
      </Button>
    </div>
  );
};

export default BarReceipt;
