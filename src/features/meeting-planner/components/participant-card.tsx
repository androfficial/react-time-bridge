/**
 * Participant card component for Meeting Planner
 */

import { useCallback } from 'react';

import type { Participant } from '@/types';

import { Clock, Trash2, User } from 'lucide-react';

import { HourPicker, TimezoneSelect } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { findTimezoneById } from '@/constants';
import { formatHour } from '@/utils';

type ParticipantCardProps = {
  canRemove: boolean;
  onRemove: (id: string) => void;
  onUpdate: (participant: Participant) => void;
  participant: Participant;
};

export const ParticipantCard = ({
  participant,
  onUpdate,
  onRemove,
  canRemove,
}: ParticipantCardProps) => {
  const handleNameChange = useCallback(
    (name: string) => {
      onUpdate({ ...participant, name });
    },
    [participant, onUpdate]
  );

  const handleTimezoneChange = useCallback(
    (timezoneId: string) => {
      const timezone = findTimezoneById(timezoneId);
      if (timezone) {
        onUpdate({ ...participant, timezone });
      }
    },
    [participant, onUpdate]
  );

  const handleWorkingHoursStartChange = useCallback(
    (start: number) => {
      onUpdate({
        ...participant,
        workingHours: { ...participant.workingHours, start },
      });
    },
    [participant, onUpdate]
  );

  const handleWorkingHoursEndChange = useCallback(
    (end: number) => {
      onUpdate({
        ...participant,
        workingHours: { ...participant.workingHours, end },
      });
    },
    [participant, onUpdate]
  );

  return (
    <Card className="group border-border/50 bg-card/80 hover:border-primary/40 hover:shadow-primary/10 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Hover gradient */}
      <div className="from-primary/5 absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {canRemove && (
        <Button
          aria-label={`Remove ${participant.name}`}
          className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground absolute top-3 right-3 z-10 h-7 w-7 rounded-lg opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110"
          onClick={() => onRemove(participant.id)}
          size="icon"
          variant="ghost"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
      <CardContent className="relative space-y-4 p-4">
        <div className="flex gap-3">
          <div className="flex-1 space-y-1.5">
            <Label
              className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase"
              htmlFor={`name-${participant.id}`}
            >
              Name
            </Label>
            <div className="relative">
              <User className="text-muted-foreground/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                className="h-10 rounded-lg pl-10 text-sm font-medium"
                id={`name-${participant.id}`}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Name"
                value={participant.name}
              />
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            <Label
              className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase"
              id={`timezone-label-${participant.id}`}
            >
              Timezone
            </Label>
            <TimezoneSelect
              onValueChange={handleTimezoneChange}
              value={participant.timezone.id}
            />
          </div>
        </div>

        <div className="bg-muted/50 border-border/50 flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="from-primary/20 to-primary/5 flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br">
              <Clock aria-hidden="true" className="text-primary h-4 w-4" />
            </div>
            <span className="text-xs font-semibold tracking-wide uppercase">
              Hours
            </span>
            <div className="flex items-center gap-1.5">
              <HourPicker
                onChange={handleWorkingHoursStartChange}
                value={participant.workingHours.start}
              />
              <span className="text-muted-foreground text-sm font-medium">
                –
              </span>
              <HourPicker
                onChange={handleWorkingHoursEndChange}
                value={participant.workingHours.end}
              />
            </div>
          </div>
          <Badge
            className="bg-primary/15 text-primary border-primary/30 h-7 px-2.5 text-xs font-semibold"
            variant="outline"
          >
            {formatHour(participant.workingHours.start, false)} –{' '}
            {formatHour(participant.workingHours.end, false)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
