/**
 * Individual slot button component for the time grid
 */

import type { MeetingSlotResult } from '@/types';

import { cn } from '@/lib/utils';
import { formatHour } from '@/utils';

type SlotButtonProps = {
  isSelected: boolean;
  onClick: () => void;
  slot: MeetingSlotResult;
  totalParticipants: number;
};

export const SlotButton = ({
  slot,
  isSelected,
  totalParticipants,
  onClick,
}: SlotButtonProps) => {
  const availabilityRatio = slot.availableCount / totalParticipants;

  return (
    <button
      className={cn(
        'group relative flex h-12 items-center justify-center rounded-xl font-semibold shadow-sm transition-all duration-300',
        'focus:ring-primary/40 hover:scale-105 hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none',
        availabilityRatio === 1 &&
          'bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30 hover:from-emerald-400 hover:to-emerald-600 hover:shadow-emerald-500/40',
        availabilityRatio > 0 &&
          availabilityRatio < 1 &&
          'bg-linear-to-br from-amber-500 to-amber-600 text-white shadow-amber-500/30 hover:from-amber-400 hover:to-amber-600 hover:shadow-amber-500/40',
        availabilityRatio === 0 &&
          'bg-muted text-muted-foreground border-border/60 hover:bg-muted/80 border shadow-none',
        isSelected &&
          'ring-primary ring-offset-background scale-105 shadow-lg ring-3 ring-offset-2'
      )}
      onClick={onClick}
    >
      <span className="text-sm transition-transform duration-200 group-hover:scale-105">
        {formatHour(slot.utcHour)}
      </span>
      <span
        className={cn(
          'absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold shadow-sm',
          availabilityRatio === 1
            ? 'border-2 border-white bg-emerald-700 text-white'
            : availabilityRatio > 0
              ? 'border-2 border-white bg-amber-700 text-white'
              : 'bg-muted-foreground/20 border-border text-muted-foreground border'
        )}
      >
        {slot.availableCount}
      </span>
    </button>
  );
};
