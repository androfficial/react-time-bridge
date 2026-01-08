/**
 * Meeting Planner - main feature component
 */

import { useCallback } from 'react';

import { Calendar, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { downloadTextFile } from '@/utils';

import {
  OptimalSlotsSummary,
  ParticipantsSection,
  SuggestedTimes,
  TimeSlotGrid,
} from './components';
import { useMeetingPlanner } from './hooks';
import { getMeetingPlannerExportFileName } from './utils';

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
    getExportText,
  } = useMeetingPlanner();

  const handleExport = useCallback(() => {
    const text = getExportText();
    const fileName = getMeetingPlannerExportFileName();
    downloadTextFile(text, fileName);
  }, [getExportText]);

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
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="flex min-w-0 items-center gap-2 text-base font-semibold sm:gap-3">
                <div className="from-primary via-primary to-primary/70 shadow-primary/30 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br shadow-lg sm:h-10 sm:w-10">
                  <Calendar
                    aria-hidden="true"
                    className="text-primary-foreground h-4 w-4 sm:h-5 sm:w-5"
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-base font-semibold sm:text-lg">
                    Meeting Times
                  </span>
                  <span className="text-muted-foreground xs:block hidden text-xs font-normal">
                    Find the perfect time for everyone
                  </span>
                </div>
              </CardTitle>
              <Button
                aria-label="Export meeting times to text file"
                className="hover:bg-primary hover:text-primary-foreground border-border/60 text-foreground shrink-0 gap-2 rounded-xl px-3 text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg sm:px-4 dark:text-white"
                onClick={handleExport}
                size="sm"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-3 pt-0 sm:space-y-5">
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
