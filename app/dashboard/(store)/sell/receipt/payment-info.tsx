import { Separator } from '@/components/ui/separator';

interface Props {
  amountReceived: number;
  change: number;
}

const PaymentInfo = ({ amountReceived, change }: Props) => {
  return (
    <div className='mt-4 space-y-1 text-xs text-gray-600'>
      <Separator />
      <div className='flex justify-between'>
        <span className='flex items-center'>Reçu:</span>
        <span>{amountReceived} G</span>
      </div>
      <div className='flex justify-between'>
        <span>Monnaie:</span>
        <span>{change} G</span>
      </div>
    </div>
  );
};

export default PaymentInfo;
