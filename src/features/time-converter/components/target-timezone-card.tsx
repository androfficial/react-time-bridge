/**
 * Target timezone card component
 */

import { Globe, MapPin } from 'lucide-react';

import { TimezoneSelect } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTimezoneOffset } from '@/utils';

type ConvertedTime = {
  date: Date;
  fullDateTime: string;
  time: string;
} | null;

type TargetTimezoneCardProps = {
  convertedTime: ConvertedTime;
  onTimezoneChange: (timezoneId: string) => void;
  timezoneId: string;
};

export const TargetTimezoneCard = ({
  timezoneId,
  convertedTime,
  onTimezoneChange,
}: TargetTimezoneCardProps) => {
  return (
    <Card className="animate-fade-in group hover:shadow-primary/15 border-border/50 bg-card/90 hover:border-primary/40 relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      {/* Decorative gradient */}
      <div className="from-primary/5 via-primary/5 absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <CardHeader className="relative pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <div className="from-primary via-primary to-primary/70 shadow-primary/25 flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
              <Globe
                aria-hidden="true"
                className="text-primary-foreground h-4 w-4"
              />
            </div>
            <span className="text-base font-semibold">To</span>
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
        {convertedTime ? (
          <div className="animate-scale-in from-primary/15 via-primary/10 border-primary/30 group/result relative overflow-hidden rounded-xl border bg-linear-to-br to-transparent p-4 transition-all duration-300 hover:shadow-lg">
            <div className="absolute top-1 right-1 opacity-10 transition-opacity duration-300 group-hover/result:opacity-20">
              <MapPin className="text-primary h-12 w-12" />
            </div>
            <p className="from-primary via-primary/90 to-primary/70 bg-linear-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent tabular-nums">
              {convertedTime.time}
            </p>
            <p className="text-muted-foreground mt-1 text-xs font-medium">
              {convertedTime.fullDateTime}
            </p>
          </div>
        ) : (
          <div className="bg-muted/40 border-muted-foreground/20 rounded-xl border-2 border-dashed p-4 text-center transition-all duration-200">
            <Globe className="text-muted-foreground/40 mx-auto mb-1.5 h-6 w-6" />
            <p className="text-muted-foreground text-xs font-medium">
              Select time to convert
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
