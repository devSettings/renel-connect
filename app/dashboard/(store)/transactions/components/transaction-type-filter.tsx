'use client';

import { ChevronsUpDown, Crown, Star, User } from 'lucide-react';

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

import { useState } from 'react';
import useQueryParameter from '@/hooks/use-query-parameter';
import { TypeOfTransaction } from '@prisma/client';

const memberships = [
  {
    value: 'Expense',
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
    icon: Star,
  },
  {
    value: 'AQUISITION',
    label: 'Aquisition',
    icon: Crown,
  },
];

export default function TransactionTypeFilter() {
  const [open, setOpen] = useState(false);
  const { query, handleQuery } = useQueryParameter('membership');

  const handleMembershipToggle = (type: TypeOfTransaction) => {
    handleQuery(type);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
                  memberships.find((membership) => membership.value === query)
                    ?.label
                }
              </Button>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-fit p-0'>
        <Command>
          <CommandInput placeholder='Search membership...' className='h-9' />
          <CommandList>
            <CommandEmpty>No membership found.</CommandEmpty>
            <CommandGroup>
              {memberships.map((membership) => {
                const MembershipIcon = membership.icon;
                return (
                  <CommandItem
                    key={membership.value}
                    onSelect={() => handleMembershipToggle(membership.value)}
                  >
                    <div className='flex items-center space-x-2 flex-1'>
                      <Checkbox
                        checked={query === membership.value}
                        onCheckedChange={() =>
                          handleMembershipToggle(membership.value)
                        }
                        id={`membership-${membership.value}`}
                      />
                      <MembershipIcon className='h-4 w-4 text-muted-foreground' />
                      <label
                        htmlFor={`membership-${membership.value}`}
                        className='flex-1 cursor-pointer'
                      >
                        {membership.label}
                      </label>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className='p-2'>
          <Button
            variant='destructive'
            size='sm'
            className='w-full bg-red-600 rounded-sm'
            onClick={() => handleQuery('')}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
