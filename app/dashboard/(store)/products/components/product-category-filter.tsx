'use client';

import { ChevronsUpDown } from 'lucide-react';

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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import getCategories, {
  Category,
} from '../create/actions/get-product-category';

export default function ProductCategoryFilter() {
  const [open, setOpen] = useState(false);
  const { query, handleQuery } = useQueryParameter('category');

  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories({
        search: query ?? '',
        pageSize: 5,
      });
      if (!response.success) {
        toast.error(response.error as string);
        return;
      }
      setCategories(response.data as Category[]);
    };
    fetchCategories();
  }, [query, open]);

  const handleCategoryToggle = (category: string) => {
    handleQuery(category);
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
            Category
            <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
          </Button>

          {query && (
            <div className='flex items-center gap-x-1'>
              <Button
                className='w-fit rounded-sm'
                variant='secondary'
                size='sm'
              >
                {categories.find((category) => category.id === query)?.name}
              </Button>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-fit p-0'>
        <Command>
          <CommandInput placeholder='Search category...' className='h-9' />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => {
                return (
                  <CommandItem
                    key={category.id}
                    onSelect={() => handleCategoryToggle(category.id)}
                  >
                    <div className='flex items-center space-x-2 flex-1'>
                      <Checkbox
                        checked={query === category.id}
                        onCheckedChange={() =>
                          handleCategoryToggle(category.id)
                        }
                        id={`category-${category.id}`}
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className='flex-1 cursor-pointer'
                      >
                        {category.name}
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
