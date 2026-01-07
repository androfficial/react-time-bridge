/**
 * Time period background color utilities
 */

import type { TimePeriod } from '@/utils';

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
