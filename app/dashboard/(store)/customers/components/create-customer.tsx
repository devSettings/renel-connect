import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const CreateCustomer = () => {
  return (
    <Button className='bg-blue-700 hover:bg-blue-900 text-white transition-colors ease-linear duration-300'>
      <Link href='/dashboard/customers/create'>Create Customer</Link>
    </Button>
  );
};

export default CreateCustomer;
