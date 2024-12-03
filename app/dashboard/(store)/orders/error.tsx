'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function OrderError({
  error,
}: {
  error: string & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='flex items-center justify-center text-red-600'>
            <AlertCircle className='mr-2 h-6 w-6' />
            Order Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-center text-gray-600 mb-4'>
            We're sorry, but there was an error fetching orders.
          </p>
          <p className='text-center text-sm text-gray-500 mb-4'>
            This could be due to a temporary system issue or a problem with your
            connection
          </p>
          {error && (
            <p className='text-center text-sm text-gray-800 bg-gray-100 p-2 rounded'>
              Error details: {error}
            </p>
          )}
        </CardContent>
        <CardFooter className='flex justify-center space-x-4'>
          <Button
            onClick={() => location.reload()}
            variant='outline'
            className='flex items-center'
          >
            <RefreshCw className='mr-2 h-4 w-4' />
            Try Again
          </Button>
          <Button asChild>
            <Link href='/dashbaord' className='flex items-center'>
              <Home className='mr-2 h-4 w-4' />
              Go to Dshboard
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
