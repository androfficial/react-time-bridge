/**
 * Time period icon component - displays icon based on time of day
 */

import type { TimePeriod } from '@/types';

import { TIME_PERIOD_ICON_CONFIG } from '@/constants';
import { cn } from '@/lib/utils';

type TimePeriodIconProps = {
  className?: string;
  period: TimePeriod;
  showLabel?: boolean;
};

export const TimePeriodIcon = ({
  period,
  className,
  showLabel = false,
}: TimePeriodIconProps) => {
  const { Icon, colorClass, label } = TIME_PERIOD_ICON_CONFIG[period];

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
