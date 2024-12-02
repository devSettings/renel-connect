import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ProductStatus } from '@prisma/client';
import { Archive, CheckCircle, FileEdit, XCircle } from 'lucide-react';

interface ProductStatusBadgeProps {
  status: ProductStatus;
}

const statusConfig: Record<
  ProductStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  ACTIVE: {
    label: 'Active',
    icon: CheckCircle,
    className:
      'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30 hover:border-emerald-400',
  },
  INACTIVE: {
    label: 'Inactive',
    icon: XCircle,
    className:
      'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30 hover:border-red-400',
  },
  DRAFT: {
    label: 'Draft',
    icon: FileEdit,
    className:
      'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 hover:bg-indigo-500/30 hover:border-indigo-400',
  },
  ARCHIVED: {
    label: 'Archived',
    icon: Archive,
    className:
      'bg-gray-500/20 text-gray-400 border-gray-500/50 hover:bg-gray-500/30 hover:border-gray-400',
  },
};

export default function ProductStatusBadge({
  status,
}: ProductStatusBadgeProps) {
  const {
    label,
    icon: Icon,
    className,
  } = statusConfig[status] || statusConfig.INACTIVE;

  return (
    <Badge
      variant='outline'
      className={cn(
        'px-2 py-1.5 text-xs font-medium border-[0.1px] transition-colors duration-200',
        'shadow-lg shadow-black/10',
        className
      )}
    >
      <Icon className='w-4 h-4 mr-2 stroke-current' />
      {label}
    </Badge>
  );
}
