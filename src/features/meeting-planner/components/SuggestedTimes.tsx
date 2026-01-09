/**
 * Suggested meeting times component - shows top 3 suggestions with scores
 */

import { useCallback } from 'react';
import type { MouseEvent } from 'react';

import type { TimeSuggestion } from '@/types';

import { Star, Trophy } from 'lucide-react';

import { TimePeriodIcon } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MEETING_PLANNER_TEXT, RATING_COLOR_CLASSES } from '@/constants';
import { cn } from '@/lib/utils';
import { formatHour, getTimePeriod } from '@/utils';

import { getMeetingRatingLabel } from '../utils';

type SuggestedTimesProps = {
  onSlotSelect: (utcHour: number) => void;
  selectedSlot: number | null;
  suggestions: TimeSuggestion[];
};

export const SuggestedTimes = ({
  suggestions,
  selectedSlot,
  onSlotSelect,
}: SuggestedTimesProps) => {
  const handleSuggestionClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const utcHour = Number(e.currentTarget.dataset.utcHour);
      if (!Number.isNaN(utcHour)) {
        onSlotSelect(utcHour);
      }
    },
    [onSlotSelect]
  );

  if (!Array.isArray(suggestions) || suggestions.length === 0) return null;

  return (
    <Card className="border-border/50 bg-card/90 overflow-hidden backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Trophy className="text-primary h-4 w-4" />
          {MEETING_PLANNER_TEXT.SUGGESTED_TIMES}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {suggestions.map((suggestion, index) => {
          const colors = RATING_COLOR_CLASSES[suggestion.rating];
          const period = getTimePeriod(suggestion.utcHour);
          const participantTimes = suggestion.participantTimes ?? [];
          const totalParticipants = participantTimes.length;
          const isSelected = selectedSlot === suggestion.utcHour;

          return (
            <button
              className={cn(
                'w-full cursor-pointer rounded-xl border-2 p-3 text-left transition-all duration-200 hover:shadow-md',
                isSelected
                  ? 'border-primary/60 bg-primary/5 shadow-sm'
                  : colors.card
              )}
              data-utc-hour={suggestion.utcHour}
              key={suggestion.utcHour}
              onClick={handleSuggestionClick}
              type="button"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {index === 0 && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-yellow-900 shadow-sm">
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <TimePeriodIcon period={period} />
                      <span className="text-sm font-bold tabular-nums">
                        {formatHour(suggestion.utcHour)} UTC
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      Score: {suggestion.perfectCount}/{totalParticipants}{' '}
                      perfect
                      {suggestion.acceptableCount > 0 &&
                        `, ${suggestion.acceptableCount}/${totalParticipants} acceptable`}
                    </p>
                  </div>
                </div>
                <Badge className={cn('text-xs font-bold', colors.badge)}>
                  {getMeetingRatingLabel(suggestion.rating)}
                </Badge>
              </div>

              {/* Participant breakdown */}
              <div className="mt-2 flex flex-wrap gap-1">
                {participantTimes.map((pt) => (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium',
                      pt.suitable
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                        : pt.acceptable
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
                    )}
                    key={pt.participant.id}
                  >
                    {pt.participant.name}: {formatHour(pt.localHour)}
                    {pt.warning && ' ⚠️'}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};
