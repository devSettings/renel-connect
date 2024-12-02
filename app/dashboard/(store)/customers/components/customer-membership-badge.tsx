import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Award, Crown, Star } from 'lucide-react';

type CustomerMembership = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

interface CustomerMembershipBadgeProps {
  membership: CustomerMembership;
}

const membershipConfig: Record<
  CustomerMembership,
  {
    label: string;
    icon: React.ElementType;
    className: string;
    glowColor: string;
  }
> = {
  PLATINUM: {
    label: 'Platinum',
    icon: Crown,
    className:
      'bg-purple-500/20 text-purple-300 border-purple-400/50 hover:bg-purple-500/30 hover:border-purple-300',
    glowColor: 'rgba(168, 85, 247, 0.5)',
  },
  GOLD: {
    label: 'Gold',
    icon: Crown,
    className:
      'bg-yellow-500/20 text-yellow-300 border-yellow-400/50 hover:bg-yellow-500/30 hover:border-yellow-300',
    glowColor: 'rgba(234, 179, 8, 0.5)',
  },
  SILVER: {
    label: 'Silver',
    icon: Star,
    className:
      'bg-blue-500/20 text-blue-300 border-blue-400/50 hover:bg-blue-500/30 hover:border-blue-300',
    glowColor: 'rgba(59, 130, 246, 0.5)',
  },
  BRONZE: {
    label: 'Bronze',
    icon: Award,
    className:
      'bg-orange-500/20 text-orange-300 border-orange-400/50 hover:bg-orange-500/30 hover:border-orange-300',
    glowColor: 'rgba(234, 88, 12, 0.5)',
  },
};

export default function CustomerMembershipBadge({
  membership,
}: CustomerMembershipBadgeProps) {
  const {
    label,
    icon: Icon,
    className,
    glowColor,
  } = membershipConfig[membership] || membershipConfig.BRONZE;

  return (
    <Badge
      variant='outline'
      className={cn(
        'px-2.5 py-1.5 text-xs font-medium border-[0.1px] transition-all duration-300 ease-in-out',
        'shadow-lg',
        className
      )}
    >
      <Icon className='w-4 h-4 mr-2 stroke-current' aria-hidden='true' />
      <span>{label}</span>
    </Badge>
  );
}
