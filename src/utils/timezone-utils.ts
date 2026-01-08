/**
 * Timezone conversion utilities using date-fns-tz
 */

import type { TimeConversionResult, TimePeriod, Timezone } from '@/types';

import { setHours, setMinutes, setSeconds } from 'date-fns';
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz';

/**
 * Convert a time from one timezone to another
 */
export const convertTime = (
  date: Date,
  sourceTimezoneId: string,
  targetTimezoneId: string
): Date => {
  // Convert from source timezone to UTC, then to target timezone
  const utcDate = fromZonedTime(date, sourceTimezoneId);
  return toZonedTime(utcDate, targetTimezoneId);
};

/**
 * Get the current time in a specific timezone
 */
export const getCurrentTimeInTimezone = (timezoneId: string): Date => {
  return toZonedTime(new Date(), timezoneId);
};

/**
 * Format a date in a specific timezone
 */
export const formatTimeInTimezone = (
  date: Date,
  timezoneId: string,
  formatStr: string = 'HH:mm'
): string => {
  return formatInTimeZone(date, timezoneId, formatStr);
};

/**
 * Format date with full timezone info
 */
export const formatDateTimeWithTimezone = (
  date: Date,
  timezoneId: string
): string => {
  return formatInTimeZone(date, timezoneId, 'MMM d, yyyy HH:mm zzz');
};

/**
 * Get offset difference between two timezones in hours
 */
export const getTimeDifferenceHours = (
  sourceTimezoneId: string,
  targetTimezoneId: string,
  referenceDate: Date = new Date()
): number => {
  const sourceTime = toZonedTime(referenceDate, sourceTimezoneId);

  // Calculate difference using actual converted times
  const sourceInTarget = convertTime(
    sourceTime,
    sourceTimezoneId,
    targetTimezoneId
  );
  const diffMs = sourceInTarget.getTime() - sourceTime.getTime();

  return Math.round(diffMs / (1000 * 60 * 60));
};

/**
 * Convert time and return detailed result
 */
export const convertTimeWithDetails = (
  sourceTime: Date,
  sourceTimezone: Timezone,
  targetTimezone: Timezone
): TimeConversionResult => {
  const convertedTime = convertTime(
    sourceTime,
    sourceTimezone.id,
    targetTimezone.id
  );

  const timeDifference = getTimeDifferenceHours(
    sourceTimezone.id,
    targetTimezone.id,
    sourceTime
  );

  return {
    sourceTimezone,
    targetTimezone,
    sourceTime,
    convertedTime,
    timeDifference,
  };
};

/**
 * Create a date with specific hour in a timezone
 */
export const createDateWithHourInTimezone = (
  hour: number,
  timezoneId: string,
  baseDate: Date = new Date()
): Date => {
  const zonedDate = toZonedTime(baseDate, timezoneId);
  const dateWithHour = setSeconds(setMinutes(setHours(zonedDate, hour), 0), 0);
  return dateWithHour;
};

/**
 * Get UTC hour from local hour in a timezone
 */
export const getUtcHourFromLocal = (
  localHour: number,
  timezoneId: string,
  referenceDate: Date = new Date()
): number => {
  const localDate = createDateWithHourInTimezone(
    localHour,
    timezoneId,
    referenceDate
  );
  const utcDate = fromZonedTime(localDate, timezoneId);
  return utcDate.getUTCHours();
};

/**
 * Get local hour from UTC hour in a timezone
 */
export const getLocalHourFromUtc = (
  utcHour: number,
  timezoneId: string,
  referenceDate: Date = new Date()
): number => {
  const utcDate = new Date(referenceDate);
  utcDate.setUTCHours(utcHour, 0, 0, 0);
  const localDate = toZonedTime(utcDate, timezoneId);
  return localDate.getHours();
};

/**
 * Format hour as 12-hour or 24-hour string
 */
export const formatHour = (hour: number, use24Hour: boolean = true): string => {
  if (use24Hour) {
    return `${hour.toString().padStart(2, '0')}:00`;
  }
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:00 ${period}`;
};

/**
 * Parse time string to hour and minute
 */
export const parseTimeString = (
  timeStr: string
): { hour: number; minute: number } => {
  const [hourStr, minuteStr] = timeStr.split(':');
  return {
    hour: parseInt(hourStr, 10),
    minute: parseInt(minuteStr || '0', 10),
  };
};

/**
 * Check if hour is within working hours range
 */
export const isWithinWorkingHours = (
  hour: number,
  startHour: number,
  endHour: number
): boolean => {
  if (startHour <= endHour) {
    return hour >= startHour && hour < endHour;
  }
  // Handle overnight working hours (e.g., 22:00 - 06:00)
  return hour >= startHour || hour < endHour;
};

/**
 * Get current UTC offset string for a timezone
 */
export const getTimezoneOffset = (
  timezoneId: string,
  date: Date = new Date()
): string => {
  const formatted = formatInTimeZone(date, timezoneId, 'xxx');
  return formatted;
};

/**
 * Get user's current timezone from browser
 */
export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'America/New_York'; // Fallback
  }
};

/**
 * Get initial timezone - user's timezone if available in TIMEZONES list, otherwise first in list
 * Note: This function requires TIMEZONES from constants, imported where used
 */
export const getInitialTimezoneId = (
  findTimezone: (id: string) => unknown,
  fallbackId: string = 'America/New_York'
): string => {
  const userTimezone = getUserTimezone();
  const found = findTimezone(userTimezone);
  return found ? userTimezone : fallbackId;
};

/**
 * Get time period based on hour (0-23)
 * Early Morning: 6-8, Morning: 9-11, Afternoon: 12-17, Evening: 18-21, Night: 22-5
 */
export const getTimePeriod = (hour: number): TimePeriod => {
  if (hour >= 6 && hour < 9) return 'early-morning';
  if (hour >= 9 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
};

/**
 * Get time period label in human readable format
 */
export const getTimePeriodLabel = (period: TimePeriod): string => {
  const labels: Record<TimePeriod, string> = {
    'early-morning': 'Early Morning',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
  };
  return labels[period];
};

/**
 * Get warning message for inconvenient time periods
 */
export const getTimePeriodWarning = (period: TimePeriod): string | null => {
  const warnings: Record<TimePeriod, string | null> = {
    'early-morning': '⚠️ Very early morning!',
    morning: null,
    afternoon: null,
    evening: null,
    night: '⚠️ Night time!',
  };
  return warnings[period];
};

/**
 * Check if time period is suitable for meetings
 */
export const isTimePeriodSuitable = (period: TimePeriod): boolean => {
  return period === 'morning' || period === 'afternoon';
};

/**
 * Check if time period is acceptable (not ideal but ok)
 */
export const isTimePeriodAcceptable = (period: TimePeriod): boolean => {
  return period === 'early-morning' || period === 'evening';
};

/**
 * Get background color class based on time period
 * Per spec: early-morning=orange, morning=yellow, afternoon=green, evening=blue, night=dark blue
 */
export const getTimePeriodBgClass = (period: TimePeriod): string => {
  const bgClasses: Record<TimePeriod, string> = {
    'early-morning': 'bg-orange-100 dark:bg-orange-900/30',
    morning: 'bg-yellow-100 dark:bg-yellow-900/30',
    afternoon: 'bg-green-100 dark:bg-green-900/30',
    evening: 'bg-blue-100 dark:bg-blue-900/30',
    night: 'bg-indigo-200 dark:bg-indigo-900/40',
  };
  return bgClasses[period];
};
