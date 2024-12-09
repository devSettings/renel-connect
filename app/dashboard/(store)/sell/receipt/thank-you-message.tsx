import { receiptData } from './receipt-data';

const ThankYouMessage = () => {
  return (
    <div className='text-center text-xs mb-4'>
      <p className='font-medium'>
        {`Merci d'avoir choisi`} {receiptData.salonName} !
      </p>
      <p className='mt-1 text-[10px] italic'>
        {`  Nous espérons que vous vous sentez belle à l'intérieur comme à
        l'extérieur.`}
      </p>
    </div>
  );
};

export default ThankYouMessage;
