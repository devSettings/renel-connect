import { debounce } from 'lodash';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import createSale from '../create-sale';

import useQueryParameter from '@/hooks/use-query-parameter';
import { useCartStore } from './use-cart-store';
import { useDiscount } from './use-discount';
import { CheckoutFormData } from '../schema/check-out';

export function useOptimizedCheckout(cashier: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();
  const { getTotal, clearCart, items } = useCartStore();
  const { calculateDiscount, resetDiscount } = useDiscount();
  const { handleQuery } = useQueryParameter('searchQuery');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCreateSale = useCallback(
    debounce(async (data: CheckoutFormData) => {
      setIsLoading(true);
      const startTime = Date.now();

      const discount = calculateDiscount(getTotal());
      const total = getTotal() - discount;

      const sale_data = {
        cashier_id: cashier,
        category: data.transactionType,
        paymentMethod: data.paymentMethod,
        sub_total: getTotal(),
        amount_received:
          data.paymentMethod === 'CASH' ? data.amountReceived : total,
        customer_change:
          data.paymentMethod === 'CASH'
            ? parseFloat((data.amountReceived! - total).toFixed(1))
            : 0,
        discount: discount,
        total: total,
        tax: 0,
        customer_id: data.customerId,
        room_number: data.roomNumber,
        transaction_receipt_id: data.transactionId,
      };

      const result = await createSale(
        sale_data,
        items.map(({ product, quantity }) => {
          const discountAmount = discount;
          const sellingPrice = product.selling_Price - discountAmount;
          return {
            product_id: product.id,
            quantity,
            unit_price: product.selling_Price,
            selling_price: sellingPrice,
            total_price: quantity * sellingPrice,
          };
        })
      );

      const endTime = Date.now();
      console.log(
        `POST /pos ${result.success ? 200 : 400} in ${endTime - startTime}ms`
      );

      if (result.success) {
        resetDiscount();
        clearCart();
        router.refresh();
        setCompleted(true);
        toast.success('Vente conclue avec succès');
        handleQuery('');
      } else {
        toast.error(result.message);
      }

      setIsLoading(false);
    }, 500),
    [
      cashier,
      calculateDiscount,
      getTotal,
      clearCart,
      items,
      resetDiscount,
      router,
    ]
  );

  return {
    isLoading,
    completed,
    createSale: debouncedCreateSale,
  };
}
