import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const CreateCustomer = () => {
  return (
    <Button>
      <Link href='/dashboard/customers/create'>Create Customer</Link>
    </Button>
  );
};

export default CreateCustomer;
