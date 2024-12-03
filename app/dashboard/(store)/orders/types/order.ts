import { OrderSource } from '@prisma/client';

export type Order = {
  id: string;
  customer?: string;
  cashier: string;
  items: number;
  amount: number;
  source: OrderSource;
  date: string;
  method: string;
};

export type OrderMetrics = {
  totalCustomers: number;
  totalIncome: number;
  averageSpent: number;
  totalOrders: number;
};

export type Revenue = { date: string; revenue: number };
