'use client';

import { redirect } from 'next/navigation';
import BarReceipt from './dashboard/(store)/sell/receipt/bar-receipt';

const HomePage = () => {
  // redirect('/dashboard');
  return (
    <div>
      <BarReceipt
        transactionId='1234567890'
        cashier='John Doe'
        items={[
          { name: 'Chamvre climatise', quantity: 1, price: 10, total: 10 },
          {
            name: 'Nouriture poues les emloyee',
            quantity: 2,
            price: 20,
            total: 40,
          },
        ]}
        subtotal={50}
        discount={10}
        tax={10}
        total={100}
        amountReceived={100}
        change={0}
        paymentMethod='CASH'
      />
    </div>
  );
};

export default HomePage;
