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
import useUserRole from '@/lib/use-user-role';
import { ProductType } from '@prisma/client';
import {
  ChartNoAxesColumnDecreasing,
  EditIcon,
  EllipsisIcon,
  FilePenLine,
  GitCompare,
  Trash,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import OrderReturnRequest from '../../orders/components/order-return-request';
import EditProductFormDialog from '../[id]/components/edit-product-dialog';

interface Props {
  id: string;
  type: ProductType;
}

const TableAction = ({ id, type }: Props) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setEditing] = useState(false);

  const role = useUserRole();
  const hasPermission = role === 'ADMIN' || role === 'DEVELOPER' ? true : false;

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
          <DropdownMenuItem disabled={!hasPermission}>
            <ChartNoAxesColumnDecreasing />
            <Link href={`/dashboard/products/${id}`}>Voir les analyses</Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <GitCompare />
            Comparer
          </DropdownMenuItem>
          {type === 'INVENTORY' && (
            <DropdownMenuItem disabled={true}>
              <FilePenLine />
              Réapprovisionner
            </DropdownMenuItem>
          )}
          {type !== 'NON_INVENTORY' && (
            <DropdownMenuItem
              disabled={!hasPermission}
              onClick={() => setEditing(true)}
            >
              <EditIcon />
              Modifier
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={handleDelete}
            disabled={!hasPermission}
          >
            <Trash />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProductFormDialog
        type={type}
        isOpen={isEditing}
        onClose={handleEdit}
        id={id}
      />
      <OrderReturnRequest
        isOpen={open}
        onClose={handleDelete}
        id={id}
      />
    </div>
  );
};

export default TableAction;
