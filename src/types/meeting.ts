/**
 * Meeting Planner type definitions
 */

import type { Timezone } from './timezone';

export interface Participant {
  id: string;
  name: string;
  timezone: Timezone;
  workingHours: WorkingHours;
}

export interface WorkingHours {
  end: number; // 0-23
  start: number; // 0-23
}

export interface TimeSlot {
  hour: number; // 0-23
  isAvailable: boolean;
  localTimes: ParticipantLocalTime[];
  participantsAvailable: string[]; // participant ids
}

export interface ParticipantLocalTime {
  isWorkingHour: boolean;
  localHour: number;
  participantId: string;
  participantName: string;
  period: 'early-morning' | 'morning' | 'afternoon' | 'evening' | 'night';
  warning?: string;
}

export interface MeetingSlotResult {
  allAvailable: boolean;
  availableCount: number;
  participantTimes: ParticipantLocalTime[];
  utcHour: number;
}

/**
 * Rating for meeting time suggestion
 */
export type MeetingRating = 'excellent' | 'good' | 'acceptable' | 'poor';

/**
 * Suggested meeting time with score
 */
export interface TimeSuggestion {
  acceptableCount: number;
  participantTimes: Array<{
    acceptable: boolean;
    localHour: number;
    localTime: Date;
    participant: Participant;
    suitable: boolean;
    warning?: string;
  }>;
  perfectCount: number;
  rating: MeetingRating;
  score: number; // 0-100
  time: Date;
  utcHour: number;
}
