/**
 * Time slot grid component showing 24-hour availability
 * Refactored to use extracted sub-components
 */

import type { MeetingSlotResult } from '@/types';

import { TimePeriodIcon } from '@/components/shared';
import { cn } from '@/lib/utils';
import { formatHour, getTimePeriod } from '@/utils';

import { SlotDetails } from './slot-details';

type TimeSlotGridProps = {
  onSlotSelect: (utcHour: number) => void;
  selectedSlot: number | null;
  slots: MeetingSlotResult[];
  totalParticipants: number;
};

export const TimeSlotGrid = ({
  slots,
  totalParticipants,
  selectedSlot,
  onSlotSelect,
}: TimeSlotGridProps) => {
  if (slots.length === 0) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        <div className="mb-3 text-4xl">👥</div>
        <p className="text-sm font-medium">
          Add participants to see available meeting times
        </p>
      </div>
    );
  }

  const getSlotColorClass = (availableCount: number, total: number): string => {
    if (total === 0) return 'bg-muted hover:bg-muted/80';
    const ratio = availableCount / total;
    if (ratio === 1)
      return 'bg-linear-to-br from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-emerald-500/20 dark:from-emerald-500 dark:to-emerald-600';
    if (ratio >= 0.75)
      return 'bg-linear-to-br from-emerald-300 to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-emerald-900 shadow-emerald-400/20 dark:from-emerald-400 dark:to-emerald-500 dark:text-white';
    if (ratio >= 0.5)
      return 'bg-linear-to-br from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-amber-900 shadow-amber-400/20 dark:from-amber-400 dark:to-amber-500';
    if (ratio > 0)
      return 'bg-linear-to-br from-orange-300 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-orange-900 shadow-orange-400/20 dark:from-orange-400 dark:to-orange-500 dark:text-white';
    return 'bg-linear-to-br from-rose-300 to-rose-400 hover:from-rose-400 hover:to-rose-500 text-rose-900 shadow-rose-400/20 dark:from-rose-400 dark:to-rose-500 dark:text-white';
  };

  const selectedSlotData = slots.find((s) => s.utcHour === selectedSlot);

  return (
    <div className="space-y-5">
      {/* Header with legend */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-base font-semibold">24-Hour Availability (UTC)</h3>
        <div className="flex items-center gap-5 text-xs">
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-lg bg-linear-to-br from-emerald-400 to-emerald-500 shadow-sm ring-2 ring-emerald-500/30" />
            <span className="text-muted-foreground font-semibold">All</span>
          </span>
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-lg bg-linear-to-br from-amber-300 to-amber-400 shadow-sm ring-2 ring-amber-400/30" />
            <span className="text-muted-foreground font-semibold">Some</span>
          </span>
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-lg bg-linear-to-br from-rose-300 to-rose-400 shadow-sm ring-2 ring-rose-400/30" />
            <span className="text-muted-foreground font-semibold">None</span>
          </span>
        </div>
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-6 gap-2.5 p-1 sm:grid-cols-8 md:grid-cols-12">
        {slots.map((slot) => {
          const period = getTimePeriod(slot.utcHour);
          const isSelected = selectedSlot === slot.utcHour;
          const isOptimal = slot.availableCount === totalParticipants;
          return (
            <button
              aria-label={`${formatHour(slot.utcHour)} UTC - ${
                slot.availableCount
              } of ${totalParticipants} available`}
              aria-pressed={isSelected}
              className={cn(
                'group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl shadow-md transition-all duration-200',
                getSlotColorClass(slot.availableCount, totalParticipants),
                isSelected
                  ? 'ring-primary ring-offset-background shadow-lg ring-2 ring-offset-1'
                  : 'hover:-translate-y-0.5 hover:shadow-lg',
                isOptimal && !isSelected && 'ring-2 ring-emerald-500/50'
              )}
              key={slot.utcHour}
              onClick={() => onSlotSelect(slot.utcHour)}
              type="button"
            >
              <TimePeriodIcon
                className="mb-0.5 h-4 w-4 drop-shadow-sm"
                period={period}
              />
              <span className="text-sm leading-tight font-bold">
                {slot.utcHour.toString().padStart(2, '0')}
              </span>
              <span className="text-[9px] font-semibold opacity-70">
                {slot.availableCount}/{totalParticipants}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected slot details */}
      {selectedSlotData && (
        <SlotDetails
          slot={selectedSlotData}
          totalParticipants={totalParticipants}
        />
      )}
    </div>
  );
};
