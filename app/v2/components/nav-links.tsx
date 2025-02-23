import { HomeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { ShoppingBasket } from 'lucide-react';

const links = [
  { name: 'Pos', href: '/dashboard', icon: HomeIcon },
  { name: 'Ordres', href: '/dashboard/customers', icon: ShoppingBasket },
  { name: 'Clients', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: 'Articles', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: 'Rapports', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            className='flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-muted/30 p-3 text-sm font-medium hover:bg-muted/20 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 transition-colors ease-linear duration-200'
          >
            <LinkIcon className='w-6' />
            <p className='hidden md:block'>{link.name}</p>
          </a>
        );
      })}
    </>
  );
}
