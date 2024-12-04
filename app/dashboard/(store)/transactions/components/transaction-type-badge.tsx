import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShoppingCart,
} from 'lucide-react';
import { TypeOfTransaction } from '@prisma/client';

interface TransactionTypeBadgeProps {
  type: TypeOfTransaction;
}

const typeConfig: Record<
  TypeOfTransaction,
  { label: string; icon: React.ElementType; className: string }
> = {
  INCOME: {
    label: 'Income',
    icon: TrendingUp,
    className:
      'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30 hover:border-emerald-400',
  },
  EXPENSE: {
    label: 'Expense',
    icon: TrendingDown,
    className:
      'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/30 hover:border-yellow-400',
  },
  LOST: {
    label: 'Loss',
    icon: AlertTriangle,
    className:
      'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30 hover:border-red-400',
  },
  AQUISITION: {
    label: 'Aquisition',
    icon: ShoppingCart,
    className:
      'bg-purple-500/20 text-purple-400 border-purple-500/50 hover:bg-purple-500/30 hover:border-purple-400',
  },
};

export default function TransactionTypeBadge({
  type,
}: TransactionTypeBadgeProps) {
  const {
    label,
    icon: Icon,
    className,
  } = typeConfig[type] || typeConfig.EXPENSE;

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
