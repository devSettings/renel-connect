import Search from '@/components/search';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Suspense } from 'react';
import getTransactions from './actions/get-transactions';
import CreateTransactionFormDialog from './components/create-transaction-dialog';
import TransactionsMetrics from './components/transaction-metrics';
import TransactionTypeFilter from './components/transaction-type-filter';
import TransactionTable from './components/transactions-table';

const TransactionsPage = async () => {
  const transactionResponse = await getTransactions();
  if (!transactionResponse.success) return null;

  console.log(transactionResponse.data);
  return (
    <div className='space-y-8'>
      <TransactionsMetrics />
      <Card className='shadow-none  flex-1 overflow-hidden border-[0.1px]   bg-[#0a0a0a] '>
        <CardHeader>
          <div className='flex items-center gap-2 justify-between'>
            <div className='flex items-center gap-4'>
              <Suspense fallback={<div>Loading search...</div>}>
                <Search />
              </Suspense>
              <TransactionTypeFilter />
            </div>
            <CreateTransactionFormDialog />
          </div>
        </CardHeader>
        <CardContent>
          <div className='hidden lg:block'>
            <TransactionTable transactions={transactionResponse.data} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
