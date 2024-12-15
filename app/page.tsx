'use client';

import { redirect } from 'next/navigation';

const HomePage = () => {
  redirect('/dashboard');
  return <div>{/* <PosReceipt /> */}</div>;
};

export default HomePage;
