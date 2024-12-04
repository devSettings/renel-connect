import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'shadow-none border-[0.1px] bg-black border-gray-300  file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex h-10 w-full rounded-md  transition-colors border-input bg-background  px-3 py-2 text-sm font-medium text-blue-800 ring-offset-background',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2',
          'focus-visible:border-blue-600',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-all duration-300 ease-out',
          'focus-visible:shadow-md text-white bg-black',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
