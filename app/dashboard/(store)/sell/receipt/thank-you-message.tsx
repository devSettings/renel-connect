import { receiptData } from './receipt-data';

const ThankYouMessage = () => {
  return (
    <div className='text-center text-xs mb-4'>
      <p className='font-medium'>
        {`Thank you for choosing`} {receiptData.salonName} !
      </p>
      <p className='mt-1 text-[10px] italic'>
        {`We hope you had a wonderful experience and look forward to serving you again.`}
      </p>
    </div>
  );
};

export default ThankYouMessage;
