import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Suspense } from 'react';
import CustomersTable from './components/customers-table';
import { ScrollArea } from '@/components/ui/scroll-area';
import CustomersMatrix from './components/customers-matrix';

const HomePage = () => {
  return (
    <ScrollArea className='h-[86vh]'>
      <div className='space-y-8'>
        <CustomersMatrix />
        <Card className='shadow-none border-[0.1px] flex-1 overflow-hidden  bg-accent/20'>
          <CardHeader>
            <div className='flex items-center gap-2 justify-between'>
              <div className='flex items-center gap-4'>
                <Suspense fallback={<div>Loading search...</div>}>
                  {/* <Search /> */}
                </Suspense>
                <div className='flex items-center gap-4'>
                  {/* <CustomerStatusSelector /> */}
                  {/* <CustomerMembershipSelector /> */}
                </div>
              </div>
              <div className='items-center gap-4 flex'>
                {/* <FormDialog /> */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CustomersTable
              customers={[]}
              totalPages={1}
              currentPage={1}
              itemsPerPage={1}
            />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default HomePage;
