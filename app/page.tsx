'use client';

import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <Link href='/dashboard'>Dashboard</Link>
      {/* <BarReceipt receiptData={[]} /> */}
    </div>
  );
};

export default HomePage;
