import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';
import Breadcrumb from './components/breadcrumb';

const LayOut = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2'>
          <div className='flex items-center gap-2 px-4'>
            <Breadcrumb />
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0 bg-black overflow-hidden'>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default LayOut;
