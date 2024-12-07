import { Calendar, User } from 'lucide-react';
import { receiptData } from './receipt-data';

interface Props {
  transactionId: string;
  cashier: string;
}

const TransactionInfo = ({ transactionId, cashier }: Props) => {
  return (
    <div className='space-y-2 text-xs mb-4 text-gray-600'>
      <div className='flex justify-between items-center'>
        <span className='font-medium'>ID de Transaction:</span>
        <span>{transactionId}</span>
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
        <span>{cashier}</span>
      </div>
    </div>
  );
};

export default TransactionInfo;
