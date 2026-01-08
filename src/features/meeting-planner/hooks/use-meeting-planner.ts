/**
 * Custom hook for Meeting Planner state and logic
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Participant } from '@/types';

import {
  DEFAULT_WORKING_HOURS,
  findTimezoneById,
  STORAGE_KEYS,
  TIMEZONES,
} from '@/constants';
import {
  calculateMeetingSlots,
  findOptimalSlots,
  generateParticipantId,
  getInitialTimezoneId,
  getTopSuggestions,
  safeStorageGetItem,
  safeStorageSetItem,
} from '@/utils';

import { buildMeetingPlannerExportText } from '../utils';

const createDefaultParticipant = (
  name: string,
  timezoneId: string
): Participant => ({
  id: generateParticipantId(),
  name,
  timezone: findTimezoneById(timezoneId) || TIMEZONES[0],
  workingHours: { ...DEFAULT_WORKING_HOURS },
});

/**
 * Get initial timezone - user's timezone if available in list
 */
const getInitialTimezone = (): string => {
  return getInitialTimezoneId(findTimezoneById);
};

/**
 * Load participants from localStorage
 */
const loadParticipants = (): Participant[] | null => {
  try {
    const stored = safeStorageGetItem(STORAGE_KEYS.PARTICIPANTS);
    if (stored) {
      const parsed = JSON.parse(stored) as Participant[];
      // Validate and restore timezone objects
      return parsed.map((p) => ({
        ...p,
        timezone: findTimezoneById(p.timezone.id) || TIMEZONES[0],
      }));
    }
  } catch {
    console.warn('Failed to load participants from localStorage');
  }
  return null;
};

/**
 * Save participants to localStorage
 */
const saveParticipants = (participants: Participant[]) => {
  try {
    safeStorageSetItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
  } catch {
    console.warn('Failed to save participants to localStorage');
  }
};

export const useMeetingPlanner = () => {
  // Initialize with saved participants or defaults with auto-detected timezone
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = loadParticipants();
    if (saved && saved.length > 0) {
      return saved;
    }
    return [
      createDefaultParticipant('You', getInitialTimezone()),
      createDefaultParticipant('Colleague', 'Europe/London'),
    ];
  });

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  // Save participants to localStorage when they change
  useEffect(() => {
    saveParticipants(participants);
  }, [participants]);

  // Calculate meeting slots
  const meetingSlots = useMemo(
    () => calculateMeetingSlots(participants),
    [participants]
  );

  // Find optimal slots (all available)
  const optimalSlots = useMemo(
    () => findOptimalSlots(participants),
    [participants]
  );

  // Get top 3 suggestions with scores
  const topSuggestions = useMemo(
    () => getTopSuggestions(participants),
    [participants]
  );

  // Add new participant
  const addParticipant = useCallback(() => {
    const newParticipant = createDefaultParticipant(
      `Participant ${participants.length + 1}`,
      TIMEZONES[participants.length % TIMEZONES.length].id
    );
    setParticipants((prev) => [...prev, newParticipant]);
  }, [participants.length]);

  // Update participant
  const updateParticipant = useCallback((updated: Participant) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  }, []);

  // Remove participant
  const removeParticipant = useCallback((id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    setSelectedSlot(null);
  }, []);

  // Select slot handler
  const selectSlot = useCallback((utcHour: number) => {
    setSelectedSlot((prev) => (prev === utcHour ? null : utcHour));
  }, []);

  // Build meeting results as plain text (pure; no file download side-effects)
  const getExportText = useCallback((): string => {
    return buildMeetingPlannerExportText({
      optimalSlots,
      participants,
    });
  }, [optimalSlots, participants]);

  return {
    participants,
    selectedSlot,
    meetingSlots,
    optimalSlots,
    topSuggestions,
    addParticipant,
    updateParticipant,
    removeParticipant,
    selectSlot,
    getExportText,
  };
};
