/**
 * Meeting slot calculation utilities
 */

import type {
  MeetingRating,
  MeetingSlotResult,
  Participant,
  TimeSuggestion,
} from '@/types';

import { HOURS_IN_DAY } from '@/constants';

import {
  getLocalHourFromUtc,
  getTimePeriod,
  getTimePeriodWarning,
  isTimePeriodAcceptable,
  isTimePeriodSuitable,
  isWithinWorkingHours,
} from './timezone-utils';

/**
 * Combined meeting data result from single calculation pass
 */
export interface MeetingData {
  optimalSlots: MeetingSlotResult[];
  slots: MeetingSlotResult[];
  topSuggestions: TimeSuggestion[];
}

/**
 * Calculate meeting availability for all 24 UTC hours
 */
export const calculateMeetingSlots = (
  participants: Participant[],
  referenceDate: Date = new Date()
): MeetingSlotResult[] => {
  if (participants.length === 0) {
    return [];
  }

  return HOURS_IN_DAY.map((utcHour) => {
    const participantTimes = participants.map((participant) => {
      const localHour = getLocalHourFromUtc(
        utcHour,
        participant.timezone.id,
        referenceDate
      );

      const isWorkingHour = isWithinWorkingHours(
        localHour,
        participant.workingHours.start,
        participant.workingHours.end
      );

      const period = getTimePeriod(localHour);
      const warning = getTimePeriodWarning(period) ?? undefined;

      return {
        participantId: participant.id,
        participantName: participant.name,
        localHour,
        isWorkingHour,
        period,
        warning,
      };
    });

    const availableCount = participantTimes.filter(
      (pt) => pt.isWorkingHour
    ).length;

    return {
      utcHour,
      allAvailable: availableCount === participants.length,
      availableCount,
      participantTimes,
    };
  });
};

/**
 * Find slots where all participants are available
 */
export const findOptimalSlots = (
  participants: Participant[],
  referenceDate: Date = new Date()
): MeetingSlotResult[] => {
  const allSlots = calculateMeetingSlots(participants, referenceDate);
  return allSlots.filter((slot) => slot.allAvailable);
};

/**
 * Find slots sorted by availability count (best first)
 */
export const findBestSlots = (
  participants: Participant[],
  referenceDate: Date = new Date()
): MeetingSlotResult[] => {
  const allSlots = calculateMeetingSlots(participants, referenceDate);
  return [...allSlots].sort((a, b) => b.availableCount - a.availableCount);
};

/**
 * Get availability score for a slot (percentage of available participants)
 */
export const getSlotScore = (
  slot: MeetingSlotResult,
  totalParticipants: number
): number => {
  if (totalParticipants === 0) return 0;
  return (slot.availableCount / totalParticipants) * 100;
};

/**
 * Calculate detailed score for a meeting slot
 * Perfect (working hours 09-18): 100 points
 * Acceptable (early-morning 06-09 or evening 18-22): 50 points
 * Not suitable (night 22-06): 0 points
 */
export const calculateSlotDetailedScore = (
  slot: MeetingSlotResult
): { acceptableCount: number; perfectCount: number; score: number } => {
  if (slot.participantTimes.length === 0) {
    return { score: 0, perfectCount: 0, acceptableCount: 0 };
  }

  let totalScore = 0;
  let perfectCount = 0;
  let acceptableCount = 0;

  slot.participantTimes.forEach((pt) => {
    const period = pt.period;
    if (isTimePeriodSuitable(period)) {
      totalScore += 100;
      perfectCount++;
    } else if (isTimePeriodAcceptable(period)) {
      totalScore += 50;
      acceptableCount++;
    }
  });

  const score = totalScore / slot.participantTimes.length;
  return { score, perfectCount, acceptableCount };
};

/**
 * Get meeting rating based on score
 */
export const getMeetingRating = (score: number): MeetingRating => {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 40) return 'acceptable';
  return 'poor';
};

/**
 * Get top 3 suggested meeting times
 */
export const getTopSuggestions = (
  participants: Participant[],
  referenceDate: Date = new Date()
): TimeSuggestion[] => {
  const allSlots = calculateMeetingSlots(participants, referenceDate);
  const participantById = new Map(participants.map((p) => [p.id, p]));

  const suggestions: TimeSuggestion[] = allSlots.map((slot) => {
    const { score, perfectCount, acceptableCount } =
      calculateSlotDetailedScore(slot);
    const rating = getMeetingRating(score);

    const participantTimes = slot.participantTimes
      .map((pt) => {
        const participant = participantById.get(pt.participantId);
        if (!participant) return null;

        const period = pt.period;
        const suitable = isTimePeriodSuitable(period);
        const acceptable = isTimePeriodAcceptable(period);

        const localTime = new Date(referenceDate);
        localTime.setHours(pt.localHour, 0, 0, 0);

        return {
          participant,
          localTime,
          localHour: pt.localHour,
          suitable,
          acceptable,
          warning: pt.warning,
        };
      })
      .filter((pt): pt is NonNullable<typeof pt> => pt !== null);

    const time = new Date(referenceDate);
    time.setUTCHours(slot.utcHour, 0, 0, 0);

    return {
      time,
      utcHour: slot.utcHour,
      score,
      rating,
      perfectCount,
      acceptableCount,
      participantTimes,
    };
  });

  // Sort by score (descending) and return top 3
  return suggestions.sort((a, b) => b.score - a.score).slice(0, 3);
};

/**
 * Get availability status label
 */
export const getAvailabilityLabel = (
  availableCount: number,
  totalParticipants: number
): string => {
  if (availableCount === totalParticipants) {
    return 'All available';
  }
  if (availableCount === 0) {
    return 'None available';
  }
  return `${availableCount}/${totalParticipants} available`;
};

/**
 * Generate unique participant ID
 */
export const generateParticipantId = (): string => {
  return `participant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate all meeting data in a single pass
 * This optimizes by computing slots once and deriving other values from them
 */
export const calculateMeetingData = (
  participants: Participant[],
  referenceDate: Date = new Date()
): MeetingData => {
  // Single pass to calculate all slots
  const slots = calculateMeetingSlots(participants, referenceDate);

  // Derive optimal slots from calculated slots
  const optimalSlots = slots.filter((slot) => slot.allAvailable);

  // Calculate suggestions from slots (reusing calculated data)
  const participantById = new Map(participants.map((p) => [p.id, p]));

  const suggestions: TimeSuggestion[] = slots.map((slot) => {
    const { score, perfectCount, acceptableCount } =
      calculateSlotDetailedScore(slot);
    const rating = getMeetingRating(score);

    const participantTimes = slot.participantTimes
      .map((pt) => {
        const participant = participantById.get(pt.participantId);
        if (!participant) return null;

        const period = pt.period;
        const suitable = isTimePeriodSuitable(period);
        const acceptable = isTimePeriodAcceptable(period);

        const localTime = new Date(referenceDate);
        localTime.setHours(pt.localHour, 0, 0, 0);

        return {
          participant,
          localTime,
          localHour: pt.localHour,
          suitable,
          acceptable,
          warning: pt.warning,
        };
      })
      .filter((pt): pt is NonNullable<typeof pt> => pt !== null);

    const time = new Date(referenceDate);
    time.setUTCHours(slot.utcHour, 0, 0, 0);

    return {
      time,
      utcHour: slot.utcHour,
      score,
      rating,
      perfectCount,
      acceptableCount,
      participantTimes,
    };
  });

  // Sort by score (descending) and take top 3
  const topSuggestions = suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    slots,
    optimalSlots,
    topSuggestions,
  };
};

/**
 * Check if a slot is still valid for given participants
 * A slot is valid if it exists in the optimal slots
 */
export const isSlotValid = (
  slotUtcHour: number | null,
  optimalSlots: MeetingSlotResult[]
): boolean => {
  if (slotUtcHour === null) return true;
  return optimalSlots.some((slot) => slot.utcHour === slotUtcHour);
};
