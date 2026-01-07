/**
 * Participants section component for Meeting Planner
 */

import type { Participant } from '@/types';

import { Plus, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { ParticipantCard } from './participant-card';

type ParticipantsSectionProps = {
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (participant: Participant) => void;
  participants: Participant[];
};

export const ParticipantsSection = ({
  participants,
  onAdd,
  onUpdate,
  onRemove,
}: ParticipantsSectionProps) => {
  return (
    <Card
      aria-labelledby="participants-heading"
      className="animate-fade-in border-border/50 bg-card/90 relative overflow-hidden backdrop-blur-sm"
    >
      {/* Decorative gradient */}
      <div className="from-primary/5 absolute inset-0 bg-linear-to-b to-transparent" />

      <CardHeader className="relative pb-2 sm:pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold sm:gap-3">
            <div className="from-primary via-primary to-primary/70 shadow-primary/30 flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br shadow-lg sm:h-10 sm:w-10">
              <Users
                aria-hidden="true"
                className="text-primary-foreground h-4 w-4 sm:h-5 sm:w-5"
              />
            </div>
            <div className="flex min-w-0 flex-col">
              <span
                className="truncate text-base font-semibold sm:text-lg"
                id="participants-heading"
              >
                Participants
              </span>
              <span className="text-muted-foreground xs:block hidden text-xs font-normal">
                Manage team availability
              </span>
            </div>
          </CardTitle>
          <Badge className="from-primary to-primary/80 text-primary-foreground h-6 min-w-6 justify-center bg-linear-to-r text-xs font-bold shadow-lg sm:h-7 sm:min-w-7 sm:text-sm">
            {participants.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-2 pt-0 sm:space-y-3">
        <Button
          className="from-primary via-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-primary/25 hover:shadow-primary/40 w-full gap-2 rounded-xl bg-linear-to-r py-2 text-xs font-semibold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] sm:py-3 sm:text-sm"
          onClick={onAdd}
          size="lg"
        >
          <Plus aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
          Add Participant
        </Button>

        <ScrollArea className="h-100 pr-2">
          <div className="space-y-3 pt-1">
            {participants.map((participant, index) => (
              <div
                className="animate-slide-up"
                key={participant.id}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ParticipantCard
                  canRemove={participants.length > 1}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  participant={participant}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
