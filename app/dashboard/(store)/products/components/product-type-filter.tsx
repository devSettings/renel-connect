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

import useQueryParameter from '@/hooks/use-query-parameter';
import { useState } from 'react';

const types = [
  {
    value: 'INVENTORY',
    label: 'Inventory',
    icon: File,
  },
  {
    value: 'SERVICE',
    label: 'Service',
    icon: User,
  },
  {
    value: 'NON_INVENTORY',
    label: 'Non Inventory',
    icon: Star,
  },
  {
    value: 'DIGITAL',
    label: 'Digital',
    icon: Crown,
  },
];

export default function ProductTypeFilter() {
  const [open, setOpen] = useState(false);
  const { query, handleQuery } = useQueryParameter('type');

  const handleTypeToggle = (type: string) => {
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
                {types.find((type) => type.value === query)?.label}
              </Button>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-fit p-0'>
        <Command>
          <CommandInput placeholder='Search type...' className='h-9' />
          <CommandList>
            <CommandEmpty>No type found.</CommandEmpty>
            <CommandGroup>
              {types.map((type) => {
                const TypeIcon = type.icon;
                return (
                  <CommandItem
                    key={type.value}
                    onSelect={() => handleTypeToggle(type.value)}
                  >
                    <div className='flex items-center space-x-2 flex-1'>
                      <Checkbox
                        checked={query === type.value}
                        onCheckedChange={() => handleTypeToggle(type.value)}
                        id={`type-${type.value}`}
                      />
                      {/* <TypeIcon className='h-4 w-4 text-muted-foreground' /> */}
                      <label
                        htmlFor={`type-${type.value}`}
                        className='flex-1 cursor-pointer'
                      >
                        {type.label}
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
