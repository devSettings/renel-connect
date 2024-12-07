import { Mail, MapPin, Phone } from 'lucide-react';
import { receiptData } from './receipt-data';

const ContactInfo = () => {
  return (
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
  );
};

export default ContactInfo;
