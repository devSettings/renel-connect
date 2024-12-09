'use client';

import Link from 'next/link';
import BarReceipt from './dashboard/(store)/sell/receipt/bar-receipt';
import { redirect } from 'next/navigation';

const HomePage = () => {
  redirect('/dashboard');
  return (
    <div>
      <Link href='/dashboard'>Dashboard</Link>
      <BarReceipt
        transactionId='1234567890'
        cashier='John Doe'
        items={[
          { name: 'Prestige', quantity: 1, sellingPrice: 10, totalCost: 10 },
          { name: 'Guniness', quantity: 2, sellingPrice: 20, totalCost: 40 },
        ]}
        subtotal={50}
        discount={10}
        tax={10}
        total={100}
        amountReceived={100}
        change={0}
        paymentMethod='Cash'
      />
    </div>
  );
};

export default HomePage;
