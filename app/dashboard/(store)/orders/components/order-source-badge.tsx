import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { OrderSource } from '@prisma/client';
import { Globe, Smartphone } from 'lucide-react';
import { FaStoreAlt } from 'react-icons/fa';

interface OrderSourceBadgeProps {
  source: OrderSource;
}

const sourceConfig: Record<
  OrderSource,
  { label: string; icon: React.ElementType; className: string }
> = {
  MOBILE: {
    label: 'Web',
    icon: Globe,
    className:
      'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/30 hover:border-cyan-400',
  },
  WEB: {
    label: 'Mobile',
    icon: Smartphone,
    className:
      'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50 hover:bg-fuchsia-500/30 hover:border-fuchsia-400',
  },
  POS: {
    label: 'POS',
    icon: FaStoreAlt,
    className:
      'bg-slate-500/20 text-slate-400 border-slate-500/50 hover:bg-slate-500/30 hover:border-slate-400',
  },
};

export default function OrderSourceBadge({ source }: OrderSourceBadgeProps) {
  const {
    label,
    icon: Icon,
    className,
  } = sourceConfig[source] || sourceConfig.POS;

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
