import type { Metadata } from 'next';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { ClerkProvider } from '@clerk/nextjs';
import { GeistSans } from 'geist/font/sans';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Renel Connect',
  description: 'Renel Connect App',
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body
          className={cn(
            GeistSans.className,
            'antialiased min-h-screen bg-background'
          )}
        >
          <ThemeProvider attribute='class' defaultTheme='dark'>
            {children}
            <Toaster position='top-right' richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
