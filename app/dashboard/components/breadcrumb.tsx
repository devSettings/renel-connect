'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter((segment) => segment !== '');

  return (
    <nav aria-label='Breadcrumb' className='py-3 px-4'>
      <ol className='flex items-center space-x-2 text-base'>
        <SidebarTrigger className='-ml-1' />

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;
          return (
            <li key={segment} className='flex items-center'>
              <ChevronRight className='w-4 h-4 text-muted-foreground mx-1' />
              {isLast ? (
                <span className='font-medium text-gray-800' aria-current='page'>
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </span>
              ) : (
                <Link
                  href={href}
                  className='text-primary hover:text-primary/50 transition-colors duration-200 ease-linear'
                >
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
