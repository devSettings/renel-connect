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
  FilePenLine,
  GitCompare,
  Trash,
} from 'lucide-react';
import Link from 'next/link';
import ProductDeleteModal from '../[id]/components/product-delete-dialog';
import { useState } from 'react';
import EditProductFormDialog from '../[id]/components/edit-product-dialog';
import { ProductType } from '@prisma/client';

interface Props {
  id: string;
  type: ProductType;
}

const TableAction = ({ id, type }: Props) => {
  const [open, setOpen] = useState(false);

  const [isEditing, setEditing] = useState(false);

  const handleDelete = () => {
    setOpen(!open);
  };

  const handleEdit = () => {
    setEditing(!isEditing);
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
          <DropdownMenuItem>
            <ChartNoAxesColumnDecreasing />
            <Link href={`/dashboard/products/${id}`}> View Analytics</Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <GitCompare />
            Compare
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={handleEdit}
            disabled={type === 'NON_INVENTORY'}
          >
            <FilePenLine />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={handleDelete}
          >
            <Trash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProductFormDialog
        type={type}
        isOpen={isEditing}
        onClose={handleEdit}
        id={id}
      />
      <ProductDeleteModal
        isOpen={open}
        onClose={handleDelete}
        id={id}
      />
    </div>
  );
};

export default TableAction;
