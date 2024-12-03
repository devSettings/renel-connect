import { Membership, UserStatus } from '@prisma/client';

export type SimpleCustomer = {
  id: string;
  firsName: string;
  lastName: string;
};

export type Customer = {
  id: string;
  lastPurchaseDate: string | null;
  status: UserStatus;
  membership: Membership;
  phoneNumber: string;
  name: string;
  totalOrders: number;
  totalSpend: number;
};

export type CustomerGenderMetrics = {
  male: number;
  female: number;
  other: number;
};

export type CustomerMembershipMetrics = {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
};
