/**
 * Optimal slots summary component
 */

import type { MeetingSlotResult } from '@/types';

import { AlertCircle, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

type OptimalSlotsSummaryProps = {
  onSlotSelect: (utcHour: number) => void;
  optimalSlots: MeetingSlotResult[];
  participantsCount: number;
};

export const OptimalSlotsSummary = ({
  optimalSlots,
  participantsCount,
  onSlotSelect,
}: OptimalSlotsSummaryProps) => {
  if (optimalSlots.length > 0) {
    return (
      <div
        aria-live="polite"
        className="animate-scale-in flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-200/70 bg-linear-to-r from-emerald-50 via-emerald-50/80 to-emerald-100/50 px-3 py-2.5 shadow-sm sm:gap-3 sm:px-4 sm:py-3 dark:border-emerald-800/50 dark:from-emerald-900/30 dark:via-emerald-900/20 dark:to-emerald-800/10"
        role="status"
      >
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25 sm:h-9 sm:w-9">
            <Sparkles aria-hidden="true" className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs font-bold text-emerald-700 sm:text-sm dark:text-emerald-300">
            {optimalSlots.length} optimal{' '}
            {optimalSlots.length === 1 ? 'slot' : 'slots'}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-wrap gap-1.5 overflow-x-auto">
          {optimalSlots.slice(0, 6).map((slot) => (
            <Badge
              className="h-6 cursor-pointer border-emerald-400/60 bg-white/95 px-2 text-[10px] font-bold text-emerald-700 tabular-nums shadow-sm transition-all duration-200 hover:bg-emerald-500 hover:text-white sm:h-7 sm:px-2.5 sm:text-xs dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-600"
              key={slot.utcHour}
              onClick={() => onSlotSelect(slot.utcHour)}
              variant="outline"
            >
              {slot.utcHour.toString().padStart(2, '0')}:00
            </Badge>
          ))}
          {optimalSlots.length > 6 && (
            <Badge
              className="h-6 shrink-0 px-2 text-[10px] font-semibold sm:h-7 sm:px-3 sm:text-xs"
              variant="secondary"
            >
              +{optimalSlots.length - 6}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  if (participantsCount > 0) {
    return (
      <div className="animate-scale-in flex items-center gap-3 rounded-2xl border border-amber-200/70 bg-linear-to-r from-amber-50 via-amber-50/80 to-amber-100/50 px-4 py-3 shadow-sm dark:border-amber-800/50 dark:from-amber-900/30 dark:via-amber-900/20 dark:to-amber-800/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg shadow-amber-500/25">
          <AlertCircle className="h-4 w-4 text-white" />
        </div>
        <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
          No slots where all are available. Try adjusting working hours.
        </p>
      </div>
    );
  }

  return null;
};
