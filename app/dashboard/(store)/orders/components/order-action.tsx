'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  ChartNoAxesColumnDecreasing,
  EllipsisIcon,
  GitCompare,
  TicketX,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import OrderReturnRequest from './order-return-request';

interface Props {
  id: string;
}

const TableAction = ({ id }: Props) => {
  const [open, setOpen] = useState(false);

  const handlerequest = () => {
    setOpen(!open);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost'>
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='min-w-[11rem]'>
          <DropdownMenuLabel className='text-center'>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={handlerequest}
          >
            <TicketX />
            Request
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <ChartNoAxesColumnDecreasing />

            <Link href={'#'}>Voir les analyses</Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <GitCompare />
            détail de la commande
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <OrderReturnRequest
        isOpen={open}
        onClose={handlerequest}
        id={id}
      />
    </div>
  );
};

export default TableAction;
