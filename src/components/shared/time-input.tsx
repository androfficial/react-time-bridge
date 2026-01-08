/**
 * Time picker component with dropdown for selecting hours and minutes
 */

import { useCallback, useMemo, useState } from 'react';

import { ChevronDown, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type TimeInputProps = {
  disabled?: boolean;
  label?: string;
  onChange: (value: string) => void;
  value: string;
};

const HOURS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, '0')
);
const MINUTES = Array.from({ length: 12 }, (_, i) =>
  (i * 5).toString().padStart(2, '0')
);

export const TimeInput = ({
  value,
  onChange,
  label,
  disabled = false,
}: TimeInputProps) => {
  const [open, setOpen] = useState(false);

  const { hours, minutes } = useMemo(() => {
    const [h, m] = value.split(':');
    return { hours: h || '12', minutes: m || '00' };
  }, [value]);

  const handleHourSelect = useCallback(
    (hour: string) => {
      onChange(`${hour}:${minutes}`);
    },
    [minutes, onChange]
  );

  const handleMinuteSelect = useCallback(
    (minute: string) => {
      onChange(`${hours}:${minute}`);
      setOpen(false);
    },
    [hours, onChange]
  );

  const formatDisplayTime = (h: string, m: string) => {
    const hour = parseInt(h, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${m} ${period}`;
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label className="text-foreground text-sm font-medium">{label}</Label>
      )}
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              'border-input bg-background hover:bg-accent h-10 w-full justify-between rounded-lg border px-3 font-medium',
              !value && 'text-muted-foreground'
            )}
            disabled={disabled}
            variant="outline"
          >
            <span className="flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <span className="tabular-nums">
                {formatDisplayTime(hours, minutes)}
              </span>
            </span>
            <ChevronDown className="text-muted-foreground h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto p-0"
          side="bottom"
          sideOffset={4}
        >
          <div className="flex">
            {/* Hours column */}
            <div className="border-border/50 border-r">
              <div className="text-muted-foreground border-border/50 border-b px-3 py-2 text-center text-xs font-semibold">
                Hour
              </div>
              <ScrollArea className="h-48 sm:h-50">
                <div className="p-1">
                  {HOURS.map((hour) => {
                    const h = parseInt(hour, 10);
                    const period = h >= 12 ? 'PM' : 'AM';
                    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
                    return (
                      <button
                        className={cn(
                          'hover:bg-accent flex w-full items-center justify-between gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                          hours === hour &&
                            'bg-primary text-primary-foreground hover:bg-primary/90'
                        )}
                        key={hour}
                        onClick={() => handleHourSelect(hour)}
                        type="button"
                      >
                        <span className="font-medium tabular-nums">
                          {displayHour}
                        </span>
                        <span className="text-xs opacity-70">{period}</span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
            {/* Minutes column */}
            <div>
              <div className="text-muted-foreground border-border/50 border-b px-3 py-2 text-center text-xs font-semibold">
                Min
              </div>
              <ScrollArea className="h-48 sm:h-50">
                <div className="p-1">
                  {MINUTES.map((minute) => (
                    <button
                      className={cn(
                        'hover:bg-accent w-full rounded-md px-4 py-1.5 text-sm font-medium tabular-nums transition-colors',
                        minutes === minute &&
                          'bg-primary text-primary-foreground hover:bg-primary/90'
                      )}
                      key={minute}
                      onClick={() => handleMinuteSelect(minute)}
                      type="button"
                    >
                      {minute}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
