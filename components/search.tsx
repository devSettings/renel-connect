'use client';

import { cn } from '@/lib/utils';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from './ui/input';
import useQueryParameter from '@/hooks/use-query-parameter';

interface Props {
  placeholder?: string;
  className?: string;
}

const Search = ({ placeholder, className }: Props) => {
  const { handleQuery } = useQueryParameter('searchQuery');
  return (
    <div className='relative w-full md:w-auto'>
      <SearchIcon className='absolute left-2 top-3.5 h-4 w-4 text-muted-foreground' />
      <Input
        type='text'
        id='search'
        onChange={(e) => handleQuery(e.target.value)}
        className={cn(
          'flex h-11 w-full bg-black lg:min-w-[20rem] text-base rounded-md border-[0.1px]  border-input bg-background px-3 py-2 pl-8  ring-offset-background transition-all ease-linear duration-300',
          'placeholder:text-muted-foreground',
          className
        )}
        placeholder={placeholder || 'Search'}
      />
    </div>
  );
};

export default Search;
