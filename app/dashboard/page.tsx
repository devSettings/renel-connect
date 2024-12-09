'use client';

import { useEffect, useState } from 'react';

export default function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className='relative w-full overflow-hidden flex h-[84vh] items-center justify-center'>
      <div className='absolute inset-0 bg-gradient-to-br  from-card via-background to-background rounded-xl'></div>
      <div
        className='absolute inset-0 bg-grid-slate-200/20 bg-[bottom_1px_center] dark:bg-grid-slate-50/[0.05]'
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)',
        }}
      ></div>
      <div className='container relative z-10 mx-auto px-4 md:px-6'>
        <div className='flex items-center justify-center'>
          <div className='relative w-full max-w-sm aspect-square'>
            {mounted && (
              <>
                <div className='absolute inset-0 rounded-full bg-gradient-to-br from-primary to-primary-foreground opacity-20 blur-3xl animate-pulse'></div>
                <svg
                  className='absolute inset-0 h-full w-full animate-spin-slow'
                  viewBox='0 0 100 100'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <circle
                    cx='50'
                    cy='50'
                    r='45'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    className='text-primary/20'
                  />
                  <path
                    d='M50 5 A45 45 0 0 1 95 50'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    className='text-primary'
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='h-24 w-24 rounded-xl bg-background shadow-lg flex items-center justify-center'>
                    <div className='h-16 w-16 rounded-lg bg-primary/20 flex items-center justify-center animate-pulse'>
                      <div className='h-8 w-8 rounded bg-blue-500'></div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
