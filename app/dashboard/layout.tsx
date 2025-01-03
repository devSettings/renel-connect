import { AppSidebar } from '@/components/app-sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';
import createUser from './action/create-user';
import Breadcrumb from './components/breadcrumb';
import DatePickerWithRange from './components/date-range-picker';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const LayOut = async ({ children }: PropsWithChildren) => {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  await createUser();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-14  py-4 shrink-0 items-center bg-black '>
          <div className='flex  w-full items-center justify-between gap-2 px-4 '>
            <Breadcrumb />
            <DatePickerWithRange />
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-2 bg-black overflow-hidden'>
          <ScrollArea className='h-[85vh]'>{children}</ScrollArea>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default LayOut;
