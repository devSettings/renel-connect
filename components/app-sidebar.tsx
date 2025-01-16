'use client';

import {
  Command,
  Frame,
  LifeBuoy,
  PieChart,
  Send,
  Settings2,
} from 'lucide-react';
import * as React from 'react';
import { FaStoreAlt } from 'react-icons/fa';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'renel',
    email: 'renel@renel.com',
    avatar: '/avatars/renel.png',
  },
  navMain: [
    {
      title: 'Store',
      url: '#',
      icon: FaStoreAlt,
      isActive: true,
      items: [
        { title: 'Sell', url: '/dashboard/sell' },
        {
          title: 'Products',
          url: '/dashboard/products',
        },
        {
          title: 'Customers',
          url: '/dashboard/customers',
        },
        {
          title: 'Orders',
          url: '/dashboard/orders',
        },
        { title: 'Reports', url: '/dashboard/reports' },
        { title: 'Transactions', url: '/dashboard/transactions' },
      ],
    },

    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Users',
          url: '/dashboard/users',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
  projects: [
    {
      name: 'Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Marketing',
      url: '#',
      icon: PieChart,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      variant='inset'
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              asChild
            >
              <a href='#'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-700 text-primary'>
                  <Command className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Renel Connect</span>
                  <span className='truncate text-xs'>Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary
          items={data.navSecondary}
          className='mt-auto'
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
