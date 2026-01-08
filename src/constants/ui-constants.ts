/**
 * UI-related constants and configurations
 */

import type { MeetingRating, TimePeriod } from '@/types';

import { Moon, Sun, Sunrise, Sunset } from 'lucide-react';

/**
 * Time period icon configuration for TimePeriodIcon component
 */
export const TIME_PERIOD_ICON_CONFIG: Record<
  TimePeriod,
  {
    colorClass: string;
    Icon: typeof Sun;
    label: string;
  }
> = {
  'early-morning': {
    Icon: Sunrise,
    colorClass: 'text-orange-500 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]',
    label: 'Early Morning',
  },
  morning: {
    Icon: Sunrise,
    colorClass: 'text-yellow-500 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]',
    label: 'Morning',
  },
  afternoon: {
    Icon: Sun,
    colorClass: 'text-green-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]',
    label: 'Afternoon',
  },
  evening: {
    Icon: Sunset,
    colorClass: 'text-blue-500 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]',
    label: 'Evening',
  },
  night: {
    Icon: Moon,
    colorClass: 'text-indigo-700 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]',
    label: 'Night',
  },
};

/**
 * Time groups configuration for TimeSlotGrid component
 */
export const TIME_GROUPS: Array<{
  bgClass: string;
  hours: number[];
  Icon: typeof Sun;
  iconColor: string;
  label: string;
  period: TimePeriod;
}> = [
  {
    period: 'night',
    label: 'Night',
    hours: [0, 1, 2, 3, 4, 5],
    Icon: Moon,
    iconColor: 'text-indigo-500',
    bgClass:
      'from-indigo-50 to-indigo-100/50 dark:from-indigo-950/40 dark:to-indigo-900/20',
  },
  {
    period: 'morning',
    label: 'Morning',
    hours: [6, 7, 8, 9, 10, 11],
    Icon: Sunrise,
    iconColor: 'text-amber-500',
    bgClass:
      'from-amber-50 to-orange-100/50 dark:from-amber-950/40 dark:to-orange-900/20',
  },
  {
    period: 'afternoon',
    label: 'Afternoon',
    hours: [12, 13, 14, 15, 16, 17],
    Icon: Sun,
    iconColor: 'text-green-500',
    bgClass:
      'from-green-50 to-emerald-100/50 dark:from-green-950/40 dark:to-emerald-900/20',
  },
  {
    period: 'evening',
    label: 'Evening',
    hours: [18, 19, 20, 21, 22, 23],
    Icon: Sunset,
    iconColor: 'text-blue-500',
    bgClass:
      'from-blue-50 to-sky-100/50 dark:from-blue-950/40 dark:to-sky-900/20',
  },
];

/**
 * Rating color classes for meeting suggestions
 */
export const RATING_COLOR_CLASSES: Record<
  MeetingRating,
  { badge: string; card: string }
> = {
  excellent: {
    badge:
      'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700',
    card: 'border-emerald-200/60 bg-emerald-50/50 dark:border-emerald-800/60 dark:bg-emerald-900/20',
  },
  good: {
    badge:
      'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
    card: 'border-blue-200/60 bg-blue-50/50 dark:border-blue-800/60 dark:bg-blue-900/20',
  },
  acceptable: {
    badge:
      'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700',
    card: 'border-amber-200/60 bg-amber-50/50 dark:border-amber-800/60 dark:bg-amber-900/20',
  },
  poor: {
    badge:
      'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-700',
    card: 'border-rose-200/60 bg-rose-50/50 dark:border-rose-800/60 dark:bg-rose-900/20',
  },
};
