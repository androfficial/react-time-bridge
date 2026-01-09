/**
 * Time slot grid component showing 24-hour availability
 * Grouped by time period for better UX
 */

import { useCallback } from 'react';
import type { MouseEvent } from 'react';

import type { MeetingSlotResult } from '@/types';

import { TimePeriodIcon } from '@/components/shared';
import { MEETING_PLANNER_TEXT, TIME_GROUPS } from '@/constants';
import { cn } from '@/lib/utils';
import { formatHour, getTimePeriod } from '@/utils';

import { SlotDetails } from './SlotDetails';

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
  const handleSlotClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const utcHour = Number(e.currentTarget.dataset.utcHour);
      if (!Number.isNaN(utcHour)) {
        onSlotSelect(utcHour);
      }
    },
    [onSlotSelect]
  );

  const safeSlots = Array.isArray(slots) ? slots : [];

  if (safeSlots.length === 0) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        <div className="mb-3 text-4xl">👥</div>
        <p className="text-sm font-medium">
          {MEETING_PLANNER_TEXT.EMPTY_GRID_MESSAGE}
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

  const selectedSlotData = safeSlots.find((s) => s.utcHour === selectedSlot);
  const slotsByHour = new Map(safeSlots.map((s) => [s.utcHour, s]));

  return (
    <div className="space-y-3 sm:space-y-5">
      {/* Header with legend */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
        <h3 className="text-xs font-semibold sm:text-base">
          {MEETING_PLANNER_TEXT.TIME_GRID_HEADER}
        </h3>
        <div className="flex items-center gap-2 text-[9px] sm:gap-5 sm:text-xs">
          <span className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded bg-linear-to-br from-emerald-400 to-emerald-500 sm:h-4 sm:w-4 sm:rounded-lg" />
            <span className="text-muted-foreground font-medium sm:font-semibold">
              {MEETING_PLANNER_TEXT.LEGEND_ALL}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded bg-linear-to-br from-amber-300 to-amber-400 sm:h-4 sm:w-4 sm:rounded-lg" />
            <span className="text-muted-foreground font-medium sm:font-semibold">
              {MEETING_PLANNER_TEXT.LEGEND_SOME}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <div className="h-2.5 w-2.5 rounded bg-linear-to-br from-rose-300 to-rose-400 sm:h-4 sm:w-4 sm:rounded-lg" />
            <span className="text-muted-foreground font-medium sm:font-semibold">
              {MEETING_PLANNER_TEXT.LEGEND_NONE}
            </span>
          </span>
        </div>
      </div>

      {/* Time Period Groups */}
      <div className="space-y-2">
        {TIME_GROUPS.map((group) => {
          const groupSlots = group.hours
            .map((h) => slotsByHour.get(h))
            .filter(Boolean) as MeetingSlotResult[];
          const bestSlot = groupSlots.reduce(
            (best, s) => (s.availableCount > best ? s.availableCount : best),
            0
          );
          const hasOptimal = bestSlot === totalParticipants;

          return (
            <div
              className={cn(
                'rounded-xl bg-linear-to-r p-2 sm:rounded-2xl sm:p-3',
                group.bgClass
              )}
              key={group.period}
            >
              {/* Group Header */}
              <div className="mb-2 flex items-center gap-2">
                <group.Icon className={cn('h-4 w-4', group.iconColor)} />
                <span className="text-xs font-semibold sm:text-sm">
                  {group.label}
                </span>
                {hasOptimal && (
                  <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[8px] font-bold text-white sm:text-[10px]">
                    {MEETING_PLANNER_TEXT.OPTIMAL_LABEL}
                  </span>
                )}
              </div>

              {/* Slots Grid */}
              <div className="grid grid-cols-6 gap-1 sm:gap-2">
                {group.hours.map((hour) => {
                  const slot = slotsByHour.get(hour);
                  if (!slot) return null;

                  const period = getTimePeriod(slot.utcHour);
                  const isSelected = selectedSlot === slot.utcHour;
                  const isOptimal = slot.availableCount === totalParticipants;

                  return (
                    <button
                      aria-label={`${formatHour(slot.utcHour)} UTC - ${slot.availableCount} of ${totalParticipants} available`}
                      aria-pressed={isSelected}
                      className={cn(
                        'group relative flex h-12 w-full cursor-pointer flex-col items-center justify-center rounded-lg shadow-md transition-all duration-200 sm:h-14 sm:rounded-xl md:h-16',
                        getSlotColorClass(
                          slot.availableCount,
                          totalParticipants
                        ),
                        isSelected
                          ? 'ring-primary ring-offset-background shadow-lg ring-2 ring-offset-1'
                          : 'hover:-translate-y-0.5 hover:shadow-lg',
                        isOptimal && !isSelected && 'ring-2 ring-emerald-500/50'
                      )}
                      data-utc-hour={slot.utcHour}
                      key={slot.utcHour}
                      onClick={handleSlotClick}
                      type="button"
                    >
                      <TimePeriodIcon
                        className="mb-0.5 h-3 w-3 drop-shadow-sm sm:h-4 sm:w-4"
                        period={period}
                      />
                      <span className="text-xs leading-tight font-bold sm:text-sm">
                        {slot.utcHour.toString().padStart(2, '0')}
                      </span>
                      <span className="text-[8px] font-semibold opacity-70 sm:text-[9px]">
                        {slot.availableCount}/{totalParticipants}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
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
