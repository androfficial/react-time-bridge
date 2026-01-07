/**
 * Time period icon component - displays icon based on time of day
 */

import type { TimePeriod } from '@/utils';

import { Moon, Sun, Sunrise, Sunset } from 'lucide-react';

import { cn } from '@/lib/utils';

type TimePeriodIconProps = {
  className?: string;
  period: TimePeriod;
  showLabel?: boolean;
};

const periodConfig: Record<
  TimePeriod,
  {
    colorClass: string;
    Icon: typeof Sun;
    label: string;
  }
> = {
  'early-morning': {
    Icon: Sunrise,
    colorClass: 'text-orange-500 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]',
    label: 'Early Morning',
  },
  morning: {
    Icon: Sunrise,
    colorClass: 'text-yellow-500 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]',
    label: 'Morning',
  },
  afternoon: {
    Icon: Sun,
    colorClass: 'text-green-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]',
    label: 'Afternoon',
  },
  evening: {
    Icon: Sunset,
    colorClass: 'text-blue-500 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]',
    label: 'Evening',
  },
  night: {
    Icon: Moon,
    colorClass: 'text-indigo-700 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]',
    label: 'Night',
  },
};

export const TimePeriodIcon = ({
  period,
  className,
  showLabel = false,
}: TimePeriodIconProps) => {
  const { Icon, colorClass, label } = periodConfig[period];

  return (
    <span
      className={cn('inline-flex items-center gap-1', className)}
      title={label}
    >
      <Icon aria-hidden="true" className={cn('h-3.5 w-3.5', colorClass)} />
      {showLabel && <span className="text-xs">{label}</span>}
    </span>
  );
};
