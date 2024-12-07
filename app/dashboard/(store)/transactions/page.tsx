import Search from '@/components/search';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Suspense } from 'react';
import getTransactions from './actions/get-transactions';
import CreateTransactionFormDialog from './components/create-transaction-dialog';
import TransactionsMetrics from './components/transaction-metrics';
import TransactionTypeFilter from './components/transaction-type-filter';
import TransactionTable from './components/transactions-table';
import { TypeOfTransaction } from '@prisma/client';

interface TransactionsPageProps {
  searchParams: Promise<{
    type?: TypeOfTransaction;
    searchQuery?: string;
    page: string;
  }>;
}

const TransactionsPage = async ({ searchParams }: TransactionsPageProps) => {
  const { type, searchQuery, page } = await searchParams;

  const currentPage = page ? parseInt(page) : 1;

  const transactionResponse = await getTransactions({
    type: type,
    search: searchQuery,
    // currentPage: currentPage,
  });
  if (!transactionResponse.success) return null;

  return (
    <div className='space-y-8'>
      <TransactionsMetrics />
      <Card className='shadow-none  flex-1 overflow-hidden border-[0.1px]'>
        <CardHeader>
          <div className='flex items-center gap-2 justify-between'>
            <div className='flex items-center gap-4'>
              <Suspense fallback={<div>Loading search...</div>}>
                <Search className='bg-black' />
              </Suspense>
              <Suspense fallback={'loading..'}>
                <TransactionTypeFilter />
              </Suspense>
            </div>
            <CreateTransactionFormDialog />
          </div>
        </CardHeader>
        <CardContent>
          <div className='hidden lg:block'>
            <TransactionTable
              totalPage={2}
              currentPage={1}
              transactions={transactionResponse.data}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
