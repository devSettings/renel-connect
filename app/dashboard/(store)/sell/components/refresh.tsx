'use client';

import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Refresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pathname = usePathname();

  const handleRefresh = () => {
    setIsRefreshing(true);

    // Use the current pathname without any query parameters
    window.location.href = pathname;
  };

  return (
    <Button
      size='icon'
      className='shadow-none bg-blue-700 h-10 hover:scale-105 transition-all duration-300'
      onClick={handleRefresh}
      disabled={isRefreshing}
    >
      <RefreshCcw
        className={`h-4 w-4 text-white ${isRefreshing ? 'animate-spin' : ''}`}
      />
    </Button>
  );
}
