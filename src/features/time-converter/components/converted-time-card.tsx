/**
 * Converted time card component - displays time in a target timezone
 */

import type { ConvertedTimeResult } from '../hooks/use-time-converter';

import { Globe, X } from 'lucide-react';

import {
  getTimePeriodBgClass,
  TimePeriodIcon,
  TimezoneSelect,
} from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getTimezoneOffset } from '@/utils';

type ConvertedTimeCardProps = {
  canRemove: boolean;
  convertedTime: ConvertedTimeResult;
  isBaseTimezone?: boolean;
  onRemove: () => void;
  onTimezoneChange: (newTimezoneId: string) => void;
};

export const ConvertedTimeCard = ({
  convertedTime,
  onTimezoneChange,
  onRemove,
  canRemove,
  isBaseTimezone = false,
}: ConvertedTimeCardProps) => {
  const {
    timezone,
    time,
    fullDateTime,
    timeDifferenceLabel,
    period,
    periodLabel,
    warning,
  } = convertedTime;

  return (
    <Card
      className={cn(
        'animate-fade-in group border-border/50 relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl',
        getTimePeriodBgClass(period),
        warning
          ? 'border-amber-300/60 hover:border-amber-400 dark:border-amber-700/60'
          : 'hover:border-primary/40 hover:shadow-primary/15'
      )}
    >
      {/* Decorative gradient */}
      <div className="from-primary/5 via-primary/5 absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Remove button */}
      {canRemove && (
        <Button
          aria-label={`Remove ${timezone.name} timezone`}
          className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground absolute top-2 left-2 z-10 h-6 w-6 rounded-md opacity-60 transition-all duration-200 hover:scale-110 hover:opacity-100"
          onClick={onRemove}
          size="icon"
          variant="ghost"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}

      <CardHeader className="relative pb-2">
        <div
          className={cn(
            'flex items-center justify-between gap-2',
            canRemove && 'pl-6'
          )}
        >
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="from-primary via-primary to-primary/70 shadow-primary/25 flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
              <Globe
                aria-hidden="true"
                className="text-primary-foreground h-4 w-4"
              />
            </div>
            <span className="text-sm font-semibold">{timezone.name}</span>
          </CardTitle>
          <div className="flex items-center gap-1.5">
            {isBaseTimezone && (
              <Badge
                className="bg-primary/20 text-primary border-primary/30 text-[10px] font-semibold"
                variant="outline"
              >
                Base
              </Badge>
            )}
            <Badge
              className="bg-primary/10 text-primary border-primary/25 px-2 py-0.5 font-mono text-[10px] font-semibold"
              variant="outline"
            >
              {getTimezoneOffset(timezone.id)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-2 pt-0">
        <TimezoneSelect
          onValueChange={onTimezoneChange}
          placeholder="Select timezone"
          value={timezone.id}
        />

        <div
          className={cn(
            'animate-scale-in group/result relative overflow-hidden rounded-xl border p-3 transition-all duration-300 hover:shadow-lg',
            warning
              ? 'border-amber-300/60 bg-amber-50/80 dark:border-amber-700/60 dark:bg-amber-900/30'
              : 'from-primary/15 via-primary/10 border-primary/30 bg-linear-to-br to-transparent'
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="from-primary via-primary/90 to-primary/70 bg-linear-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent tabular-nums">
                {time}
              </p>
              <p className="text-muted-foreground mt-0.5 text-[11px] font-medium">
                {fullDateTime}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <TimePeriodIcon className="h-4 w-4" period={period} />
                <span className="text-foreground text-xs font-semibold">
                  {periodLabel}
                </span>
              </div>
              <Badge
                className={cn(
                  'mt-1 px-2 py-0.5 text-[10px] font-bold',
                  timeDifferenceLabel === 'Same time'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                )}
                variant="secondary"
              >
                📊 {timeDifferenceLabel}
              </Badge>
            </div>
          </div>
          {warning && (
            <p className="mt-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
              {warning}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
