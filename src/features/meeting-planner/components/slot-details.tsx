/**
 * Slot details component - shows participant availability for selected time slot
 */

import type { MeetingSlotResult } from '@/types';

import { TimePeriodIcon } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatHour, getAvailabilityLabel, getTimePeriod } from '@/utils';

type SlotDetailsProps = {
  slot: MeetingSlotResult;
  totalParticipants: number;
};

export const SlotDetails = ({ slot, totalParticipants }: SlotDetailsProps) => {
  const period = getTimePeriod(slot.utcHour);

  return (
    <div className="animate-scale-in bg-muted/40 border-border/60 space-y-4 rounded-2xl border p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-3 text-base font-semibold">
          <TimePeriodIcon period={period} showLabel />
          <span>{formatHour(slot.utcHour)} UTC</span>
        </h4>
        <Badge
          className={cn(
            'h-7 px-4 text-sm font-semibold shadow-sm',
            slot.allAvailable
              ? 'border-0 bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/25'
              : ''
          )}
          variant={slot.allAvailable ? 'default' : 'secondary'}
        >
          {getAvailabilityLabel(slot.availableCount, totalParticipants)}
        </Badge>
      </div>

      <div className="grid gap-2">
        {slot.participantTimes.map((pt) => {
          const participantPeriod = pt.period ?? getTimePeriod(pt.localHour);
          return (
            <div
              className={cn(
                'flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition-all duration-200 hover:scale-[1.01]',
                pt.isWorkingHour
                  ? 'border border-emerald-200/60 bg-emerald-100/90 shadow-sm dark:border-emerald-800/60 dark:bg-emerald-900/40'
                  : 'border border-rose-200/60 bg-rose-100/90 shadow-sm dark:border-rose-800/60 dark:bg-rose-900/40'
              )}
              key={pt.participantId}
            >
              <div className="flex flex-col">
                <span className="font-semibold">{pt.participantName}</span>
                {pt.warning && (
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    {pt.warning}
                  </span>
                )}
              </div>
              <span className="flex items-center gap-3">
                <TimePeriodIcon
                  className="h-4 w-4"
                  period={participantPeriod}
                />
                <span className="w-12 text-right font-semibold tabular-nums">
                  {formatHour(pt.localHour)}
                </span>
                <span
                  className={cn(
                    'w-20 text-right text-xs font-bold',
                    pt.isWorkingHour
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-rose-700 dark:text-rose-400'
                  )}
                >
                  {pt.isWorkingHour ? '✓ Available' : '✗ Outside'}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
