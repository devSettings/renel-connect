'use client';

import {
  Check,
  ChevronsUpDown,
  Clock,
  Home,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';
import * as React from 'react';

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

const orderStatuses = [
  {
    value: 'pending',
    label: 'Pending',
    icon: Clock,
  },
  {
    value: 'processing',
    label: 'Processing',
    icon: Package,
  },
  {
    value: 'shipped',
    label: 'Shipped',
    icon: Truck,
  },
  {
    value: 'delivered',
    label: 'Delivered',
    icon: Home,
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    icon: XCircle,
  },
];

export default function OrderPaymentMethodFilter() {
  const [open, setOpen] = React.useState(false);
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((s) => s !== status)
        : [...current, status]
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className='flex items-center gap-2 border border-dashed rounded-sm h-10  px-1 py-2.5'>
          <Button
            size='sm'
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-fit justify-between rounded-sm'
          >
            {selectedStatuses.length > 2
              ? `+${selectedStatuses.length} statuses selected`
              : 'status'}

            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
          {selectedStatuses.length > 0 && selectedStatuses.length < 3 && (
            <div className='flex items-center gap-2'>
              {selectedStatuses.map((status) => (
                <Button
                  className='w-fit rounded-sm'
                  key={status}
                  variant='secondary'
                  size='sm'
                >
                  {status}
                </Button>
              ))}
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-[280px] p-0'>
        <Command>
          <CommandInput placeholder='Search order status...' className='h-9' />
          <CommandList>
            <CommandEmpty>No order status found.</CommandEmpty>
            <CommandGroup>
              {orderStatuses.map((status) => {
                const StatusIcon = status.icon;
                return (
                  <CommandItem
                    key={status.value}
                    onSelect={() => handleStatusToggle(status.value)}
                  >
                    <div className='flex items-center space-x-2 flex-1'>
                      <Checkbox
                        checked={selectedStatuses.includes(status.value)}
                        onCheckedChange={() => handleStatusToggle(status.value)}
                        id={`status-${status.value}`}
                      />
                      <StatusIcon className='h-4 w-4 text-muted-foreground' />
                      <label
                        htmlFor={`status-${status.value}`}
                        className='flex-1 cursor-pointer'
                      >
                        {status.label}
                      </label>
                    </div>
                    {selectedStatuses.includes(status.value) && (
                      <Check className='ml-auto h-4 w-4' />
                    )}
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
