'use client';

import { useRef } from 'react';
import { formatCurrency } from './format-currency';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { FaPrint } from 'react-icons/fa';

interface SalesSummary {
  totalSales: number;
  averageSaleValue: number;
  totalNewCustomers: number;
  totalIncome: number;
}

interface PaymentMethods {
  cash: number;
  creditCard: number;
  debitCard: number;
}

interface TopSellingItem {
  name: string;
  units?: number;
  revenue: number;
}

interface Totals {
  netSales: number;
  taxCollected: number;
  grossSales: number;
}

interface ReceiptData {
  date: string;
  time: string;
  salesSummary: SalesSummary;
  paymentMethods: PaymentMethods;
  topSellingItems: TopSellingItem[];
  totals: Totals;
}

const receiptData: ReceiptData = {
  date: new Date().toLocaleDateString('en-US'),
  time: new Date().toLocaleTimeString('en-US'),
  salesSummary: {
    totalSales: 1234.56,
    transactions: 45,
    avgTransaction: 27.43,
  },
  paymentMethods: {
    cash: 500.0,
    creditCard: 650.56,
    debitCard: 84.0,
  },
  topSellingItems: [
    { name: 'Product A', units: 20, revenue: 100 },
    { name: 'Product B', units: 15, revenue: 100 },
    { name: 'Product C', units: 12, revenue: 100 },
  ],
  totals: {
    netSales: 1234.56,
    taxCollected: 0,
    grossSales: 1333.32,
  },
};

interface PosReceiptProps {
  topSellingItems: TopSellingItem[];
  summary: SalesSummary;
}

export default function PosReceipt({
  topSellingItems,
  summary,
}: PosReceiptProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
  });

  return (
    <section>
      <div
        ref={contentRef}
        className='text-sm w-[80mm] h-auto mx-auto p-6 bg-white shadow-lg rounded-lg screen-only print:block print-only'
      >
        <div className='text-center mb-6'>
          <h2 className='text-2xl font-bold '>La Pause Inn</h2>
          <h3 className='text-lg font-semibold mt-1'>
            Renel Connect POS Report
          </h3>
        </div>

        <div className='mb-6 bg-gray-100 p-4 rounded-md'>
          <Row
            label='Date'
            value={receiptData.date}
          />
          <Row
            label='Time'
            value={receiptData.time}
          />
        </div>

        <Section title='Sales Summary'>
          <Row
            label='Total Sales'
            value={formatCurrency(summary.totalSales)}
          />
          <Row
            label=''
            value={summary.totalNewCustomers.toString()}
          />
          <Row
            label='Avg Sale Value'
            value={formatCurrency(summary.averageSaleValue)}
          />
        </Section>

        <Section title='Payment Methods'>
          <Row
            label='Cash'
            value={formatCurrency(receiptData.paymentMethods.cash)}
          />
          <Row
            label='Credit Card'
            value={formatCurrency(receiptData.paymentMethods.creditCard)}
          />
          <Row
            label='Debit Card'
            value={formatCurrency(receiptData.paymentMethods.debitCard)}
          />
        </Section>

        <Section title='Top Selling Items'>
          {topSellingItems.map((item, index) => (
            <Row
              key={index}
              label={`${index + 1}. ${item.name}`}
              value={`${item.revenue}`}
            />
          ))}
        </Section>

        <Section
          title='Totals'
          className='bg-gray-100 p-4 rounded-md'
        >
          <Row
            label='Net Sales'
            value={formatCurrency(receiptData.totals.netSales)}
            isBold
          />
          <Row
            label='Tax Collected'
            value={formatCurrency(receiptData.totals.taxCollected)}
            isBold
          />
          <Row
            label='Gross Sales'
            value={formatCurrency(receiptData.totals.grossSales)}
            isBold
          />
        </Section>

        <div className='text-center mt-6 italic'>
          Thank you for choosing La Pause Inn!
        </div>
      </div>
      <Button
        className=' bg-blue-700 hover:bg-blue-900 text-white w-full'
        onClick={() => reactToPrintFn()}
      >
        <FaPrint className='w-4 h-4 mr-2' />
        Print receipt
      </Button>
    </section>
  );
}

function Section({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-6 ${className}`}>
      <h4 className='text-lg font-semibold  mb-3 pb-2 border-b border-gray-300'>
        {title}
      </h4>
      <div className='space-y-2'>{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  isBold = false,
}: {
  label: string;
  value: string;
  isBold?: boolean;
}) {
  const className = `flex justify-between items-center ${
    isBold ? 'font-semibold' : ''
  }`;
  return (
    <div className={className}>
      <span className='t'>{label}:</span>
      <span className=''>{value}</span>
    </div>
  );
}
