/**
 * Time Converter - main feature component
 */

import { Globe } from 'lucide-react';

import { TIME_CONVERTER_TEXT } from '@/constants';

import {
  AddTimezoneDialog,
  ConvertedTimeCard,
  SourceTimezoneCard,
} from './components';
import { useTimeConverter } from './hooks';

export const TimeConverter = () => {
  const {
    sourceTimezoneId,
    setSourceTimezoneId,
    sourceTime,
    setSourceTime,
    sourceDate,
    setSourceDate,
    convertedTimes,
    addTargetTimezone,
    removeTargetTimezone,
    updateTargetTimezone,
    setCurrentTime,
    availableTimezones,
  } = useTimeConverter();

  const hasConvertedTimes =
    Array.isArray(convertedTimes) && convertedTimes.length > 0;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 pt-1">
      {/* Source Time Section */}
      <SourceTimezoneCard
        date={sourceDate}
        onDateChange={setSourceDate}
        onSetCurrentTime={setCurrentTime}
        onTimeChange={setSourceTime}
        onTimezoneChange={setSourceTimezoneId}
        time={sourceTime}
        timezoneId={sourceTimezoneId}
      />

      {/* Converted Times Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Globe className="text-primary h-4 w-4" />
            {TIME_CONVERTER_TEXT.SECTION_TITLE}
          </h3>
          <AddTimezoneDialog
            disabled={availableTimezones.length === 0}
            onAdd={addTargetTimezone}
          />
        </div>

        {!hasConvertedTimes ? (
          <div className="bg-muted/40 border-muted-foreground/20 rounded-xl border-2 border-dashed p-8 text-center">
            <Globe className="text-muted-foreground/40 mx-auto mb-2 h-8 w-8" />
            <p className="text-muted-foreground text-sm font-medium">
              {TIME_CONVERTER_TEXT.EMPTY_STATE_TITLE}
            </p>
            <p className="text-muted-foreground/70 mt-1 text-xs">
              {TIME_CONVERTER_TEXT.EMPTY_STATE_HINT}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {convertedTimes.map((result, index) => (
              <ConvertedTimeCard
                canRemove={convertedTimes.length > 1}
                convertedTime={result}
                isBaseTimezone={index === 0}
                key={result.timezone.id}
                onRemove={removeTargetTimezone}
                onTimezoneChange={updateTargetTimezone}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
