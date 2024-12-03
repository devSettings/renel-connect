import { Skeleton } from '@/components/ui/skeleton';

export default function ProductLoading() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {/* Generate 9 skeleton cards */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className='bg-muted/40 border rounded-lg p-4 space-y-3 relative'
        >
          {/* Title Skeleton */}
          <Skeleton className='h-6 w-3/4' />

          {/* Subtitle Skeleton */}
          <Skeleton className='h-4 w-1/2' />

          {/* Price Skeleton */}
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-24' />
            {/* Add Button Skeleton */}
            <Skeleton className='h-10 w-10 ml-2 rounded-full' />
          </div>
        </div>
      ))}
    </div>
  );
}
