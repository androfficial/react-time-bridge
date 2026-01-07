/**
 * Timezone-related type definitions
 */

export interface Timezone {
  abbreviation: string;
  id: string;
  name: string;
  offset: string;
  region: string;
}

export interface TimezoneGroup {
  region: string;
  timezones: Timezone[];
}

export interface TimeConversionResult {
  convertedTime: Date;
  sourceTime: Date;
  sourceTimezone: Timezone;
  targetTimezone: Timezone;
  timeDifference: number; // in hours
}
