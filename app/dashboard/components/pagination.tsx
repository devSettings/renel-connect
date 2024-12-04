'use client';

import { Button } from '@/components/ui/button';
import useQueryParameter from '@/hooks/use-query-parameter';

interface Props {
  totalPages: number;
  currentPage: number;
}

const Pagination = ({ totalPages, currentPage }: Props) => {
  const { handleQuery: handlePageQuery } = useQueryParameter('page');

  return (
    <div className='flex w-full flex-col sm:flex-row items-center justify-end  sm:space-y-0'>
      <div className='flex items-center space-x-3'>
        <Button
          className='border-[0.1px] shadow-none'
          onClick={() => handlePageQuery((currentPage - 1).toString())}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>

        <Button
          className='border-[0.1px] shadow-none '
          disabled={currentPage >= totalPages}
          onClick={() => handlePageQuery((currentPage + 1).toString())}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
