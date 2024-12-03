import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';
import Breadcrumb from './components/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';

const LayOut = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-14 shrink-0 items-center bg-black '>
          <div className='flex items-center gap-2 px-4 '>
            <Breadcrumb />
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0   bg-black overflow-hidden'>
          <ScrollArea className='h-[85vh]'>{children}</ScrollArea>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default LayOut;
