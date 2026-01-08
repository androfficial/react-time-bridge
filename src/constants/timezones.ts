/**
 * Timezone constants - common timezones grouped by region
 */

import type { Timezone, TimezoneGroup } from '@/types';

export const TIMEZONES: Timezone[] = [
  // North America
  {
    id: 'America/New_York',
    name: 'New York',
    abbreviation: 'EST/EDT',
    offset: '-05:00',
    region: 'North America',
  },
  {
    id: 'America/Chicago',
    name: 'Chicago',
    abbreviation: 'CST/CDT',
    offset: '-06:00',
    region: 'North America',
  },
  {
    id: 'America/Denver',
    name: 'Denver',
    abbreviation: 'MST/MDT',
    offset: '-07:00',
    region: 'North America',
  },
  {
    id: 'America/Los_Angeles',
    name: 'Los Angeles',
    abbreviation: 'PST/PDT',
    offset: '-08:00',
    region: 'North America',
  },
  {
    id: 'America/Toronto',
    name: 'Toronto',
    abbreviation: 'EST/EDT',
    offset: '-05:00',
    region: 'North America',
  },
  {
    id: 'America/Vancouver',
    name: 'Vancouver',
    abbreviation: 'PST/PDT',
    offset: '-08:00',
    region: 'North America',
  },

  // Europe
  {
    id: 'Europe/London',
    name: 'London',
    abbreviation: 'GMT/BST',
    offset: '+00:00',
    region: 'Europe',
  },
  {
    id: 'Europe/Paris',
    name: 'Paris',
    abbreviation: 'CET/CEST',
    offset: '+01:00',
    region: 'Europe',
  },
  {
    id: 'Europe/Berlin',
    name: 'Berlin',
    abbreviation: 'CET/CEST',
    offset: '+01:00',
    region: 'Europe',
  },
  {
    id: 'Europe/Moscow',
    name: 'Moscow',
    abbreviation: 'MSK',
    offset: '+03:00',
    region: 'Europe',
  },
  {
    id: 'Europe/Kyiv',
    name: 'Kyiv',
    abbreviation: 'EET/EEST',
    offset: '+02:00',
    region: 'Europe',
  },
  {
    id: 'Europe/Warsaw',
    name: 'Warsaw',
    abbreviation: 'CET/CEST',
    offset: '+01:00',
    region: 'Europe',
  },

  // Asia
  {
    id: 'Asia/Tokyo',
    name: 'Tokyo',
    abbreviation: 'JST',
    offset: '+09:00',
    region: 'Asia',
  },
  {
    id: 'Asia/Shanghai',
    name: 'Shanghai',
    abbreviation: 'CST',
    offset: '+08:00',
    region: 'Asia',
  },
  {
    id: 'Asia/Hong_Kong',
    name: 'Hong Kong',
    abbreviation: 'HKT',
    offset: '+08:00',
    region: 'Asia',
  },
  {
    id: 'Asia/Singapore',
    name: 'Singapore',
    abbreviation: 'SGT',
    offset: '+08:00',
    region: 'Asia',
  },
  {
    id: 'Asia/Dubai',
    name: 'Dubai',
    abbreviation: 'GST',
    offset: '+04:00',
    region: 'Asia',
  },
  {
    id: 'Asia/Kolkata',
    name: 'Mumbai',
    abbreviation: 'IST',
    offset: '+05:30',
    region: 'Asia',
  },
  {
    id: 'Asia/Seoul',
    name: 'Seoul',
    abbreviation: 'KST',
    offset: '+09:00',
    region: 'Asia',
  },

  // Australia & Pacific
  {
    id: 'Australia/Sydney',
    name: 'Sydney',
    abbreviation: 'AEST/AEDT',
    offset: '+10:00',
    region: 'Australia & Pacific',
  },
  {
    id: 'Australia/Melbourne',
    name: 'Melbourne',
    abbreviation: 'AEST/AEDT',
    offset: '+10:00',
    region: 'Australia & Pacific',
  },
  {
    id: 'Pacific/Auckland',
    name: 'Auckland',
    abbreviation: 'NZST/NZDT',
    offset: '+12:00',
    region: 'Australia & Pacific',
  },

  // South America
  {
    id: 'America/Sao_Paulo',
    name: 'São Paulo',
    abbreviation: 'BRT',
    offset: '-03:00',
    region: 'South America',
  },
  {
    id: 'America/Buenos_Aires',
    name: 'Buenos Aires',
    abbreviation: 'ART',
    offset: '-03:00',
    region: 'South America',
  },

  // Africa
  {
    id: 'Africa/Cairo',
    name: 'Cairo',
    abbreviation: 'EET',
    offset: '+02:00',
    region: 'Africa',
  },
  {
    id: 'Africa/Johannesburg',
    name: 'Johannesburg',
    abbreviation: 'SAST',
    offset: '+02:00',
    region: 'Africa',
  },

  // UTC
  {
    id: 'UTC',
    name: 'UTC',
    abbreviation: 'UTC',
    offset: '+00:00',
    region: 'Universal',
  },
];

/**
 * Get timezones grouped by region
 */
export const getTimezoneGroups = (): TimezoneGroup[] => {
  const groups: Record<string, Timezone[]> = {};

  TIMEZONES.forEach((tz) => {
    if (!groups[tz.region]) {
      groups[tz.region] = [];
    }
    groups[tz.region].push(tz);
  });

  return Object.entries(groups).map(([region, timezones]) => ({
    region,
    timezones,
  }));
};

/**
 * Find timezone by ID
 */
export const findTimezoneById = (id: string): Timezone | undefined => {
  return TIMEZONES.find((tz) => tz.id === id);
};
