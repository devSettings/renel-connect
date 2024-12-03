import { z } from 'zod';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { discountSchema } from '../schema/discount';

export type DiscountFormValues = z.infer<typeof discountSchema>;

interface DiscountState extends DiscountFormValues {
  discountPercentage: number;
  setDiscount: (values: DiscountFormValues) => void;
  calculateDiscount: (subtotal: number) => number;
  resetDiscount: () => void;
}

const defaultState: Omit<
  DiscountState,
  'setDiscount' | 'calculateDiscount' | 'resetDiscount'
> = {
  discountType: 'PERCENTAGE',
  discountValue: 0,
  confirmationCode: '',
  discountPercentage: 0,
};

const useDiscountStore = create<DiscountState>()(
  persist(
    (set, get) => ({
      ...defaultState,
      setDiscount: (values) => {
        set({
          discountType: values.discountType,
          discountValue: values.discountValue,
          confirmationCode: values.confirmationCode,
        });
      },
      calculateDiscount: (subtotal) => {
        const { discountType, discountValue, discountPercentage } = get();
        let calculatedDiscount = 0;
        let percentageEquivalent = 0;

        if (discountType === 'PERCENTAGE') {
          calculatedDiscount = (subtotal * discountValue) / 100;
          percentageEquivalent = discountValue;
        } else if (discountType === 'FIXED') {
          calculatedDiscount = Math.min(discountValue, subtotal);
          percentageEquivalent = (calculatedDiscount / subtotal) * 100;
        }

        // Only update state if the percentage changes
        if (percentageEquivalent !== discountPercentage) {
          set({ discountPercentage: percentageEquivalent });
        }

        return calculatedDiscount;
      },
      resetDiscount: () => {
        set({
          discountType: 'PERCENTAGE',
          discountValue: 0,
          confirmationCode: '',
          discountPercentage: 0,
        });
      },
    }),
    {
      name: 'discount-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function useDiscount() {
  return useDiscountStore();
}
