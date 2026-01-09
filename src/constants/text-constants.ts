/**
 * Text constants for UI strings
 */

/**
 * Time Converter feature text strings
 */
export const TIME_CONVERTER_TEXT = {
  ADD_TIMEZONE: 'Add Timezone',
  ADD_TIMEZONE_CANCEL: 'Cancel',
  ADD_TIMEZONE_CONFIRM: 'Add',
  ADD_TIMEZONE_DESCRIPTION: 'Select a timezone to add to the converter.',
  ADD_TIMEZONE_TITLE: 'Add Timezone',
  EMPTY_STATE_HINT: 'Click "Add Timezone" to start converting',
  EMPTY_STATE_TITLE: 'No target timezones added yet',
  SECTION_TITLE: 'Time in other zones',
  SET_CURRENT_TIME: 'Set Current Time',
  SOURCE_TIME: 'Source Time',
} as const;

/**
 * Meeting Planner feature text strings
 */
export const MEETING_PLANNER_TEXT = {
  ADD_PARTICIPANT: 'Add Participant',
  DEFAULT_COLLEAGUE_NAME: 'Colleague',
  DEFAULT_PARTICIPANT_NAME_PREFIX: 'Participant',
  DEFAULT_YOU_NAME: 'You',
  EMPTY_GRID_MESSAGE: 'Add participants to see available meeting times',
  EXPORT: 'Export',
  EXPORT_ARIA_LABEL: 'Export meeting times to text file',
  FIND_PERFECT_TIME: 'Find the perfect time for everyone',
  HOURS_LABEL: 'Hours',
  LEGEND_ALL: 'All',
  LEGEND_NONE: 'None',
  LEGEND_SOME: 'Some',
  MANAGE_AVAILABILITY: 'Manage team availability',
  MEETING_TIMES: 'Meeting Times',
  NAME_LABEL: 'Name',
  NAME_PLACEHOLDER: 'Name',
  OPTIMAL_LABEL: '✓ Optimal',
  PARTICIPANTS: 'Participants',
  SUGGESTED_TIMES: 'Suggested Meeting Times',
  TIMEZONE_LABEL: 'Timezone',
  TIME_GRID_HEADER: '24-Hour Availability (UTC)',
} as const;

/**
 * Common/shared text strings
 */
export const COMMON_TEXT = {
  CANCEL: 'Cancel',
  HOURS: 'hours',
  SAME_TIME: 'Same time',
  UTC: 'UTC',
} as const;
