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
  FilePenLine,
  GitCompare,
  Trash,
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  id: string;
}

const TableAction = ({ id }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='min-w-[11rem]'>
        <DropdownMenuLabel className='text-center'>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ChartNoAxesColumnDecreasing />
          <Link href={`/dashboard/products/${id}`}> View Analytics</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <GitCompare />
          Compare
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FilePenLine />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Trash />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableAction;
