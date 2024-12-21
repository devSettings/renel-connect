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
        { title: 'Vendre', url: '/dashboard/sell' },
        {
          title: 'Produits',
          url: '/dashboard/products',
        },
        {
          title: 'Clients',
          url: '/dashboard/customers',
        },
        {
          title: 'Commandes',
          url: '/dashboard/orders',
        },
        { title: 'Rapports', url: '/dashboard/reports' },
        { title: 'Transactions', url: '/dashboard/transactions' },
      ],
    },

    {
      title: 'Paramètres',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Utilisateurs',
          url: '/dashboard/users',
        },
        {
          title: 'Equipe',
          url: '#',
        },
        {
          title: 'Facturation',
          url: '#',
        },
        {
          title: 'Limites',
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
      name: 'Ingénierie',
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
