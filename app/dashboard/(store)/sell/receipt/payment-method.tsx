import { Banknote } from 'lucide-react';

interface Props {
  method: string;
}

const PaymentMethod = ({ method }: Props) => {
  return (
    <div className='mt-6 text-center'>
      <Banknote className='w-6 h-6 mx-auto text-gray-400 mb-1' />
      <p className='text-xs text-gray-600'>Payé en {method}</p>
    </div>
  );
};

export default PaymentMethod;
