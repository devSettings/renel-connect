import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@prisma/client';
import { CheckCircle, Clock, PackageCheck, XCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  PROCESSING: {
    label: 'Processing',
    icon: Clock,
    className:
      'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 hover:bg-indigo-500/30 hover:border-indigo-400',
  },
  COMPLETED: {
    label: 'Completed',
    icon: CheckCircle,
    className:
      'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30 hover:border-emerald-400',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    className:
      'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30 hover:border-red-400',
  },
  PENDING: {
    label: 'Pending',
    icon: PackageCheck,
    className:
      'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/30 hover:border-yellow-400',
  },
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const {
    label,
    icon: Icon,
    className,
  } = statusConfig[status] || statusConfig.CANCELLED;

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
