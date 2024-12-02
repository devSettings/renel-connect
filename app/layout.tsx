import type { Metadata } from 'next';
import './globals.css';

import { cn } from '@/lib/utils';
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
  title: 'Renel Connect',
  description: 'Renel Connect App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(
          GeistSans.className,
          'antialiased min-h-screen bg-background'
        )}
      >
        {children}
      </body>
    </html>
  );
}
