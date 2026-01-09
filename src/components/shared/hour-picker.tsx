/**
 * Hour picker component with dropdown for selecting hours (0-23)
 */

import { useCallback, useState } from 'react';
import type { MouseEvent } from 'react';

import { ChevronDown, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type HourPickerProps = {
  disabled?: boolean;
  onChange: (hour: number) => void;
  value: number;
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const HourPicker = ({
  value,
  onChange,
  disabled = false,
}: HourPickerProps) => {
  const [open, setOpen] = useState(false);

  const handleHourClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const hour = Number(e.currentTarget.dataset.hour);
      if (!Number.isNaN(hour)) {
        onChange(hour);
        setOpen(false);
      }
    },
    [onChange]
  );

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return { displayHour, period };
  };

  const { displayHour, period } = formatHour(value);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'border-input bg-background hover:bg-accent h-8 w-20 justify-between rounded-md border px-2 font-semibold tabular-nums',
            disabled && 'cursor-not-allowed opacity-50'
          )}
          disabled={disabled}
          variant="outline"
        >
          <span className="flex items-center gap-1">
            <span>{displayHour}</span>
            <span className="text-muted-foreground text-[10px]">{period}</span>
          </span>
          <ChevronDown className="text-muted-foreground h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <div className="text-muted-foreground border-border/50 flex items-center gap-2 border-b px-3 py-2 text-xs font-semibold">
          <Clock className="h-3.5 w-3.5" />
          Select Hour
        </div>
        <ScrollArea className="h-60">
          <div className="grid grid-cols-4 gap-1 p-2">
            {HOURS.map((hour) => {
              const { displayHour: dh, period: p } = formatHour(hour);
              return (
                <button
                  className={cn(
                    'hover:bg-accent flex flex-col items-center rounded-md px-2 py-1.5 text-sm transition-colors',
                    value === hour &&
                      'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                  data-hour={hour}
                  key={hour}
                  onClick={handleHourClick}
                  type="button"
                >
                  <span className="font-semibold tabular-nums">{dh}</span>
                  <span className="text-[10px] opacity-70">{p}</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
