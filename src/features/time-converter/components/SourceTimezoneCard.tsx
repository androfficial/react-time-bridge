/**
 * Source timezone card component
 */

import { Clock, RotateCcw } from 'lucide-react';

import { DateInput, TimeInput, TimezoneSelect } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTimezoneOffset } from '@/utils';

type SourceTimezoneCardProps = {
  date: string;
  onDateChange: (date: string) => void;
  onSetCurrentTime: () => void;
  onTimeChange: (time: string) => void;
  onTimezoneChange: (timezoneId: string) => void;
  time: string;
  timezoneId: string;
};

export const SourceTimezoneCard = ({
  timezoneId,
  time,
  date,
  onTimezoneChange,
  onTimeChange,
  onDateChange,
  onSetCurrentTime,
}: SourceTimezoneCardProps) => {
  return (
    <Card className="animate-fade-in group hover:shadow-primary/15 border-border/50 bg-card/90 hover:border-primary/40 relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      {/* Decorative gradient */}
      <div className="from-primary/5 via-primary/5 absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <CardHeader className="relative pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="from-primary via-primary to-primary/70 shadow-primary/25 flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
              <Clock
                aria-hidden="true"
                className="text-primary-foreground h-4 w-4"
              />
            </div>
            <span className="text-base font-semibold">Source Time</span>
          </CardTitle>
          <Badge
            className="bg-primary/10 text-primary border-primary/25 px-2.5 py-0.5 font-mono text-[11px] font-semibold"
            variant="outline"
          >
            UTC {getTimezoneOffset(timezoneId)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-3 pt-0">
        <TimezoneSelect
          onValueChange={onTimezoneChange}
          placeholder="Select timezone"
          value={timezoneId}
        />
        <div className="grid grid-cols-2 gap-2">
          <DateInput onChange={onDateChange} value={date} />
          <TimeInput onChange={onTimeChange} value={time} />
        </div>
        <Button
          aria-label="Use current date and time"
          className="hover:bg-primary hover:text-primary-foreground border-border/60 bg-card w-full gap-2 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] dark:text-white"
          onClick={onSetCurrentTime}
          size="sm"
          variant="outline"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Set Current Time
        </Button>
      </CardContent>
    </Card>
  );
};
