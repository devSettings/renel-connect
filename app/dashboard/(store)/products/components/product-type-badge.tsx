import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ProductType } from '@prisma/client';
import { Box, Cog, FileMusic, Package } from 'lucide-react';

interface ProductTypeBadgeProps {
  type: ProductType;
}

const typeConfig: Record<
  ProductType,
  { label: string; icon: React.ElementType; className: string }
> = {
  INVENTORY: {
    label: 'Inventory',
    icon: Package,
    className:
      'bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30 hover:border-blue-400',
  },
  SERVICE: {
    label: 'Service',
    icon: Cog,
    className:
      'bg-purple-500/20 text-purple-400 border-purple-500/50 hover:bg-purple-500/30 hover:border-purple-400',
  },
  NON_INVENTORY: {
    label: 'Non-Inventory',
    icon: Box,
    className:
      'bg-orange-500/20 text-orange-400 border-orange-500/50 hover:bg-orange-500/30 hover:border-orange-400',
  },
  DIGITAL: {
    label: 'Digital',
    icon: FileMusic,
    className: '',
  },
};

export default function ProductTypeBadge({ type }: ProductTypeBadgeProps) {
  const { label, icon: Icon, className } = typeConfig[type];

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
