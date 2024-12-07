'use client';

import {
  ChevronsUpDown,
  Crown,
  LucideIcon,
  Star,
  User,
  UserRoundX,
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
import { UserStatus } from '@prisma/client';
import { useState } from 'react';

const statuses: { value: UserStatus; label: string; icon: LucideIcon }[] = [
  {
    value: 'ACTIVE',
    label: 'Active',
    icon: User,
  },
  {
    value: 'INACTIVE',
    label: 'Inactive',
    icon: UserRoundX,
  },
  {
    value: 'SUSPENDED',
    label: 'Suspended',
    icon: Star,
  },
  {
    value: 'BANNED',
    label: 'Banned',
    icon: Crown,
  },
];

export default function CustomerStatusFilter() {
  const [open, setOpen] = useState(false);
  const { query, handleQuery } = useQueryParameter('status');

  const handleStatusToggle = (status: UserStatus) => {
    handleQuery(status);
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
            Status
            <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
          </Button>

          {query && (
            <div className='flex items-center gap-x-1'>
              <Button
                className='w-fit rounded-sm'
                variant='secondary'
                size='sm'
              >
                {statuses.find((status) => status.value === query)?.label}
              </Button>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-fit p-0'>
        <Command>
          <CommandInput placeholder='Search status...' className='h-9' />
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {statuses.map((status) => {
                const StatusIcon = status.icon;
                return (
                  <CommandItem
                    key={status.value}
                    onSelect={() => handleStatusToggle(status.value)}
                  >
                    <div className='flex items-center space-x-2 flex-1'>
                      <Checkbox
                        checked={query === status.value}
                        onCheckedChange={() => handleStatusToggle(status.value)}
                        id={`status-${status.value}`}
                      />
                      <StatusIcon className='h-4 w-4 text-muted-foreground' />
                      <label
                        htmlFor={`membership-${status.value}`}
                        className='flex-1 cursor-pointer'
                      >
                        {status.label}
                      </label>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
        {/* <div className='p-2'>
          <Button
            variant='destructive'
            size='sm'
            className='w-full bg-red-600 rounded-sm'
            onClick={() => handleQuery('')}
          >
            Clear
          </Button>
        </div> */}
      </PopoverContent>
    </Popover>
  );
}