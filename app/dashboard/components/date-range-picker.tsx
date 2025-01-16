'use client';

import { addDays, format, subMonths, subYears } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import useQueryParameter from '@/hooks/use-query-parameter';

export default function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const today = new Date();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: today,
    to: today,
  });
  const [open, setOpen] = React.useState(false);

  const handleRangeSelect = (months: number) => {
    const from = months === 12 ? subYears(today, 1) : subMonths(today, months);
    setDate({ from, to: today });
    setOpen(false);
  };

  const { handleQuery } = useQueryParameter('date');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleQuery(
      `${format(date?.from!, 'yyyy-MM-dd') || ''}x${
        format(date?.to!, 'yyyy-MM-dd') || ''
      }`
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-4', className)}
    >
      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <Popover
            open={open}
            onOpenChange={setOpen}
          >
            <PopoverTrigger asChild>
              <Button
                id='date-range'
                variant={'outline'}
                className={cn(
                  'w-[300px] justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'LLL dd, y')} -{' '}
                      {format(date.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(date.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto p-0'
              align='start'
            >
              <Calendar
                initialFocus
                mode='range'
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
              <div className='flex justify-end gap-2 p-3 bg-muted/50'>
                <Button
                  type='button'
                  variant='outline'
                  className='border-dashed'
                  size='sm'
                  onClick={() => handleRangeSelect(3)}
                  disabled
                >
                  Today
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='border-dashed'
                  size='sm'
                  onClick={() => handleRangeSelect(3)}
                  disabled
                >
                  3 Months
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='border-dashed'
                  size='sm'
                  onClick={() => handleRangeSelect(6)}
                  disabled
                >
                  6 Months
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='border-dashed'
                  size='sm'
                  onClick={() => handleRangeSelect(9)}
                  disabled
                >
                  9 Months
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='border-dashed'
                  size='sm'
                  onClick={() => handleRangeSelect(12)}
                  disabled
                >
                  1 Year
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='border-dashed'
                  size='sm'
                  onClick={() => handleRangeSelect(24)}
                  disabled
                >
                  2 Years
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='border-dashed'
                  size='sm'
                  onClick={() => handleRangeSelect(36)}
                  disabled
                >
                  3 Years
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            disabled={!date?.from && !date?.to}
            type='submit'
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
}
