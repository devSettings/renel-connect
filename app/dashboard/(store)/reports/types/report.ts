export type ReportMetrics = {
  totalNewCustomers: number;
  totalIncome: number;
  averageSaleValue: number;
  totalSales: number;
};

export type Sale = {
  id: string;
  customer?: string;
  cashier: string;
  items: number;
  amount: number;
  category: string;
  date: string;
};

export type ItemReport = {
  id: string;
  name: string;
  quantitySold: number;
  totalSalesCount: number;
  averageSalePrice: number;
  totalRevenue: number;
  lastPurchaseDate: string;
  salesContribution: number;
  quantityInStock: number;
};
