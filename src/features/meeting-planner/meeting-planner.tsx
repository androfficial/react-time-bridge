/**
 * Meeting Planner - main feature component
 */

import { Calendar, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  OptimalSlotsSummary,
  ParticipantsSection,
  SuggestedTimes,
  TimeSlotGrid,
} from './components';
import { useMeetingPlanner } from './hooks';

export const MeetingPlanner = () => {
  const {
    participants,
    selectedSlot,
    meetingSlots,
    optimalSlots,
    topSuggestions,
    addParticipant,
    updateParticipant,
    removeParticipant,
    selectSlot,
    exportToText,
  } = useMeetingPlanner();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
        <div className="space-y-4">
          <ParticipantsSection
            onAdd={addParticipant}
            onRemove={removeParticipant}
            onUpdate={updateParticipant}
            participants={participants}
          />

          {/* Suggested Times - Top 3 */}
          {participants.length > 0 && (
            <SuggestedTimes
              onSlotSelect={selectSlot}
              selectedSlot={selectedSlot}
              suggestions={topSuggestions}
            />
          )}
        </div>

        <Card className="animate-fade-in border-border/50 bg-card/90 relative overflow-hidden backdrop-blur-sm">
          {/* Decorative gradient */}
          <div className="from-primary/5 absolute inset-0 bg-linear-to-br to-transparent" />

          <CardHeader className="relative pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-base font-semibold">
                <div className="from-primary via-primary to-primary/70 shadow-primary/30 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br shadow-lg">
                  <Calendar
                    aria-hidden="true"
                    className="text-primary-foreground h-5 w-5"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">Meeting Times</span>
                  <span className="text-muted-foreground text-xs font-normal">
                    Find the perfect time for everyone
                  </span>
                </div>
              </CardTitle>
              <Button
                aria-label="Export meeting times to text file"
                className="hover:bg-primary hover:text-primary-foreground border-border/60 text-foreground gap-2 rounded-xl px-4 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg dark:text-white"
                onClick={exportToText}
                size="sm"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-5 pt-0">
            <OptimalSlotsSummary
              onSlotSelect={selectSlot}
              optimalSlots={optimalSlots}
              participantsCount={participants.length}
            />

            <TimeSlotGrid
              onSlotSelect={selectSlot}
              selectedSlot={selectedSlot}
              slots={meetingSlots}
              totalParticipants={participants.length}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
