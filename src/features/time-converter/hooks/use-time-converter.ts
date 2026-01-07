/**
 * Custom hook for Time Converter state and logic
 */

import { useCallback, useMemo, useState } from 'react';

import type { Timezone } from '@/types';

import { findTimezoneById, TIMEZONES } from '@/constants';
import {
  convertTime,
  formatDateTimeWithTimezone,
  formatTimeInTimezone,
  getTimeDifferenceHours,
  getTimePeriod,
  getTimePeriodWarning,
  getUserTimezone,
} from '@/utils';

const getCurrentTimeString = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

const getCurrentDateString = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

/**
 * Get initial timezone - user's timezone if available in list, otherwise first in list
 */
const getInitialTimezone = (): string => {
  const userTimezone = getUserTimezone();
  const found = findTimezoneById(userTimezone);
  return found ? userTimezone : TIMEZONES[0]?.id || 'America/New_York';
};

/**
 * Default target timezones (3-5 popular ones)
 */
const getDefaultTargetTimezones = (excludeId: string): string[] => {
  const defaults = [
    'Europe/London',
    'Europe/Berlin',
    'Asia/Tokyo',
    'America/Los_Angeles',
  ];
  return defaults.filter((id) => id !== excludeId).slice(0, 4);
};

export interface ConvertedTimeResult {
  date: Date;
  fullDateTime: string;
  period: ReturnType<typeof getTimePeriod>;
  periodLabel: string;
  time: string;
  timeDifference: number;
  timeDifferenceLabel: string;
  timezone: Timezone;
  warning: string | null;
}

export const useTimeConverter = () => {
  // State for source timezone and time - auto-detect user's timezone
  const [sourceTimezoneId, setSourceTimezoneId] = useState(getInitialTimezone);
  const [sourceTime, setSourceTime] = useState(getCurrentTimeString);
  const [sourceDate, setSourceDate] = useState(getCurrentDateString);

  // State for multiple target timezones
  const [targetTimezoneIds, setTargetTimezoneIds] = useState<string[]>(() =>
    getDefaultTargetTimezones(getInitialTimezone())
  );

  // Get timezone objects
  const sourceTimezone = useMemo(
    () => findTimezoneById(sourceTimezoneId),
    [sourceTimezoneId]
  );

  // Calculate converted times for all targets
  const convertedTimes = useMemo((): ConvertedTimeResult[] => {
    if (!sourceTimezone || !sourceTime || !sourceDate) return [];

    const [hours, minutes] = sourceTime.split(':').map(Number);
    const [year, month, day] = sourceDate.split('-').map(Number);
    const sourceDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);

    return targetTimezoneIds
      .map((targetId) => {
        const targetTimezone = findTimezoneById(targetId);
        if (!targetTimezone) return null;

        try {
          const converted = convertTime(
            sourceDateTime,
            sourceTimezoneId,
            targetId
          );
          const timeDifference = getTimeDifferenceHours(
            sourceTimezoneId,
            targetId,
            sourceDateTime
          );

          const period = getTimePeriod(converted.getHours());
          const warning = getTimePeriodWarning(period);

          const timeDifferenceLabel =
            timeDifference === 0
              ? 'Same time'
              : timeDifference > 0
                ? `+${timeDifference} hours`
                : `${timeDifference} hours`;

          const periodLabels = {
            'early-morning': '🌅 Early morning',
            morning: '☀️ Morning',
            afternoon: '🌤️ Working hours',
            evening: '🏠 Evening',
            night: '🌙 Night time',
          };

          return {
            time: formatTimeInTimezone(converted, targetId, 'HH:mm'),
            fullDateTime: formatDateTimeWithTimezone(converted, targetId),
            date: converted,
            timeDifference,
            timeDifferenceLabel,
            period,
            periodLabel: periodLabels[period],
            warning,
            timezone: targetTimezone,
          };
        } catch (error) {
          console.error('Conversion error:', error);
          return null;
        }
      })
      .filter((result): result is ConvertedTimeResult => result !== null);
  }, [
    sourceTime,
    sourceDate,
    sourceTimezoneId,
    targetTimezoneIds,
    sourceTimezone,
  ]);

  // Add target timezone
  const addTargetTimezone = useCallback((timezoneId: string) => {
    setTargetTimezoneIds((prev) => {
      if (prev.includes(timezoneId)) return prev;
      return [...prev, timezoneId];
    });
  }, []);

  // Remove target timezone
  const removeTargetTimezone = useCallback((timezoneId: string) => {
    setTargetTimezoneIds((prev) => prev.filter((id) => id !== timezoneId));
  }, []);

  // Update target timezone at specific index
  const updateTargetTimezone = useCallback((oldId: string, newId: string) => {
    setTargetTimezoneIds((prev) =>
      prev.map((id) => (id === oldId ? newId : id))
    );
  }, []);

  // Set current time handler
  const setCurrentTime = useCallback(() => {
    setSourceTime(getCurrentTimeString());
    setSourceDate(getCurrentDateString());
  }, []);

  // Available timezones for adding (not already selected)
  const availableTimezones = useMemo(() => {
    const usedIds = new Set([sourceTimezoneId, ...targetTimezoneIds]);
    return TIMEZONES.filter((tz) => !usedIds.has(tz.id));
  }, [sourceTimezoneId, targetTimezoneIds]);

  return {
    sourceTimezoneId,
    setSourceTimezoneId,
    sourceTime,
    setSourceTime,
    sourceDate,
    setSourceDate,
    sourceTimezone,
    targetTimezoneIds,
    convertedTimes,
    addTargetTimezone,
    removeTargetTimezone,
    updateTargetTimezone,
    setCurrentTime,
    availableTimezones,
  };
};
