'use client';

import {
  AlertTriangleIcon,
  ChevronsUpDown,
  Crown,
  ShoppingBag,
  ShoppingCart,
  Star,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import useQueryParameter from '@/hooks/use-query-parameter';
import { TypeOfTransaction } from '@prisma/client';
import { useState } from 'react';

const transactions = [
  {
    value: 'EXPENSE',
    label: 'Expense',
    icon: User,
  },
  {
    value: 'INCOME',
    label: 'Income',
    icon: User,
  },
  {
    value: 'LOST',
    label: 'Lost',
    icon: AlertTriangleIcon,
  },
  {
    value: 'AQUISITION',
    label: 'Aquisition',
    icon: ShoppingCart,
  },
  {
    value: 'ADJUSTMENT',
    label: 'Adjustment',
    icon: ShoppingCart,
  },
];

export default function TransactionTypeFilter() {
  const [open, setOpen] = useState(false);
  const { query, handleQuery } = useQueryParameter('type');

  const handleTransactionToggle = (type: TypeOfTransaction) => {
    handleQuery(type);
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <div className='flex items-center gap-1 border border-dashed rounded-sm h-10 px-1 py-2.5'>
          <Button
            size='sm'
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-fit justify-between rounded-sm'
          >
            Type
            <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
          </Button>

          {query && (
            <div className='flex items-center gap-x-1'>
              <Button
                className='w-fit rounded-sm'
                variant='secondary'
                size='sm'
              >
                {
                  transactions.find(
                    (transaction) => transaction.value === query
                  )?.label
                }
              </Button>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-fit p-0'>
        <Command>
          <CommandInput
            placeholder='Search transaction type'
            className='h-9'
          />
          <CommandList>
            <CommandEmpty>transaction type not found.</CommandEmpty>
            <CommandGroup>
              {transactions.map((transaction) => {
                const TransactionIcon = transaction.icon;
                return (
                  <CommandItem
                    key={transaction.value}
                    onSelect={() =>
                      handleTransactionToggle(
                        transaction.value as TypeOfTransaction
                      )
                    }
                  >
                    <div className='flex items-center space-x-2 flex-1'>
                      <Checkbox
                        checked={query === transaction.value}
                        onCheckedChange={() =>
                          handleTransactionToggle(
                            transaction.value as TypeOfTransaction
                          )
                        }
                        id={`transaction-${transaction.value}`}
                      />
                      <TransactionIcon className='h-4 w-4 text-muted-foreground' />
                      <label
                        htmlFor={`transaction-${transaction.value}`}
                        className='flex-1 cursor-pointer'
                      >
                        {transaction.label}
                      </label>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
