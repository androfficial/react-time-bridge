/**
 * Application-wide constants
 */

import type { TimePeriod } from '@/types';

/**
 * LocalStorage keys
 */
export const STORAGE_KEYS = {
  ACTIVE_TAB: 'time-bridge-active-tab',
  PARTICIPANTS: 'time-bridge-participants',
  THEME: 'time-bridge-theme',
} as const;

/**
 * Default working hours (9 AM - 6 PM)
 */
export const DEFAULT_WORKING_HOURS = {
  start: 9,
  end: 18,
} as const;

/**
 * Hours in a day for iteration (0-23)
 */
export const HOURS_IN_DAY = Array.from({ length: 24 }, (_, i) => i);

/**
 * Valid tab values for main navigation
 */
export const VALID_TABS = ['converter', 'planner'] as const;
export type TabValue = (typeof VALID_TABS)[number];

/**
 * Time period labels with icons for display
 */
export const TIME_PERIOD_LABELS: Record<TimePeriod, string> = {
  'early-morning': '🌅 Early morning',
  morning: '☀️ Morning',
  afternoon: '🌤️ Working hours',
  evening: '🏠 Evening',
  night: '🌙 Night time',
};
