import { TypeOfTransaction } from '@prisma/client';

export type Transaction = {
  id: string;
  title: string;
  type: TypeOfTransaction;
  madeBy: string | null;
  amount: number;
  date: string;
};

export type TransactionMetrics = {
  expenses: number;
  loses: number;
  aquisitions: number;
  income: number;
};
