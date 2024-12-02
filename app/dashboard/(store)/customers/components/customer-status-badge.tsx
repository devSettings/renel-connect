import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { UserCheck, UserX, UserMinus, UserX2 } from 'lucide-react';

type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED';

interface CustomerStatusBadgeProps {
  status: UserStatus;
}

const statusConfig: Record<
  UserStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  ACTIVE: {
    label: 'Active',
    icon: UserCheck,
    className:
      'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30 hover:border-emerald-400',
  },
  INACTIVE: {
    label: 'Inactive',
    icon: UserX,
    className:
      'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/30 hover:border-yellow-400',
  },
  SUSPENDED: {
    label: 'Suspended',
    icon: UserMinus,
    className:
      'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30 hover:border-red-400',
  },
  BANNED: {
    label: 'Banned',
    icon: UserX2,
    className:
      'bg-gray-500/20 text-gray-400 border-gray-500/50 hover:bg-gray-500/30 hover:border-gray-400',
  },
};

export default function CustomerStatusBadge({
  status,
}: CustomerStatusBadgeProps) {
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
