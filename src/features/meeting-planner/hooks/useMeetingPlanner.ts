/**
 * Custom hook for Meeting Planner state and logic
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { Participant, Timezone, WorkingHours } from '@/types';

import {
  DEFAULT_WORKING_HOURS,
  findTimezoneById,
  MEETING_PLANNER_TEXT,
  STORAGE_KEYS,
  TIMEZONES,
} from '@/constants';
import {
  calculateMeetingData,
  debounce,
  generateParticipantId,
  getInitialTimezoneId,
  isSlotValid,
  safeStorageGetItem,
  safeStorageSetItem,
} from '@/utils';

import { buildMeetingPlannerExportText } from '../utils';

/**
 * Debounce delay for localStorage saves (ms)
 */
const STORAGE_DEBOUNCE_DELAY = 400;

/**
 * Create a default participant with given name and timezone
 */
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
 * Validate that a value is a valid WorkingHours object
 */
const isValidWorkingHours = (value: unknown): value is WorkingHours => {
  if (typeof value !== 'object' || value === null) return false;
  const wh = value as Record<string, unknown>;
  return (
    typeof wh.start === 'number' &&
    typeof wh.end === 'number' &&
    wh.start >= 0 &&
    wh.start <= 23 &&
    wh.end >= 0 &&
    wh.end <= 23
  );
};

/**
 * Validate that a value has the required Timezone id property
 */
const hasTimezoneId = (value: unknown): value is { id: string } => {
  if (typeof value !== 'object' || value === null) return false;
  const tz = value as Record<string, unknown>;
  return typeof tz.id === 'string' && tz.id.length > 0;
};

/**
 * Validate that a raw participant object has all required fields
 */
const isValidRawParticipant = (
  value: unknown
): value is {
  id: string;
  name: string;
  timezone: { id: string };
  workingHours: WorkingHours;
} => {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Record<string, unknown>;

  return (
    typeof p.id === 'string' &&
    p.id.length > 0 &&
    typeof p.name === 'string' &&
    hasTimezoneId(p.timezone) &&
    isValidWorkingHours(p.workingHours)
  );
};

/**
 * Load and validate participants from localStorage
 * Returns null if data is invalid or missing
 */
const loadParticipants = (): Participant[] | null => {
  try {
    const stored = safeStorageGetItem(STORAGE_KEYS.PARTICIPANTS);
    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);

    // Validate that parsed data is an array
    if (!Array.isArray(parsed)) {
      console.warn('Invalid participants data: not an array');
      return null;
    }

    // Validate and restore each participant
    const validParticipants: Participant[] = [];

    for (const item of parsed) {
      if (!isValidRawParticipant(item)) {
        console.warn('Skipping invalid participant:', item);
        continue;
      }

      const timezone: Timezone | undefined = findTimezoneById(item.timezone.id);
      if (!timezone) {
        console.warn(`Unknown timezone: ${item.timezone.id}, using default`);
      }

      validParticipants.push({
        id: item.id,
        name: item.name,
        timezone: timezone || TIMEZONES[0],
        workingHours: {
          start: item.workingHours.start,
          end: item.workingHours.end,
        },
      });
    }

    return validParticipants.length > 0 ? validParticipants : null;
  } catch (error) {
    console.warn('Failed to load participants from localStorage:', error);
    return null;
  }
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

/**
 * Get default participants list
 */
const getDefaultParticipants = (): Participant[] => [
  createDefaultParticipant(
    MEETING_PLANNER_TEXT.DEFAULT_YOU_NAME,
    getInitialTimezone()
  ),
  createDefaultParticipant(
    MEETING_PLANNER_TEXT.DEFAULT_COLLEAGUE_NAME,
    'Europe/London'
  ),
];

/**
 * Initialize participants state
 */
const getInitialParticipants = (): {
  initialCounter: number;
  participants: Participant[];
} => {
  const saved = loadParticipants();
  if (saved && saved.length > 0) {
    return { participants: saved, initialCounter: saved.length };
  }
  const defaults = getDefaultParticipants();
  return { participants: defaults, initialCounter: defaults.length };
};

export const useMeetingPlanner = () => {
  // Initialize state and counter together to avoid ref access during render
  const [{ participants: initialParticipants, initialCounter }] = useState(
    getInitialParticipants
  );

  // Counter for generating unique participant names (avoids dependency on participants.length)
  const participantCounterRef = useRef(initialCounter);

  const [participants, setParticipants] =
    useState<Participant[]>(initialParticipants);

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  // Create debounced save function (stable reference)
  const debouncedSaveRef = useRef(
    debounce(saveParticipants, STORAGE_DEBOUNCE_DELAY)
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    const debouncedSave = debouncedSaveRef.current;
    return () => {
      debouncedSave.cancel();
    };
  }, []);

  // Save participants to localStorage when they change (debounced)
  useEffect(() => {
    debouncedSaveRef.current(participants);
  }, [participants]);

  // Calculate all meeting data in a single optimized pass
  const meetingData = useMemo(
    () => calculateMeetingData(participants),
    [participants]
  );

  // Destructure meeting data for convenience
  const { slots: meetingSlots, optimalSlots, topSuggestions } = meetingData;

  // Compute validated selectedSlot - auto-reset if invalid
  const validatedSelectedSlot = useMemo(() => {
    if (selectedSlot === null) return null;
    return isSlotValid(selectedSlot, optimalSlots) ? selectedSlot : null;
  }, [selectedSlot, optimalSlots]);

  // Add new participant (no dependency on participants.length)
  const addParticipant = useCallback(() => {
    participantCounterRef.current += 1;
    const counter = participantCounterRef.current;

    setParticipants((prev) => {
      const newParticipant = createDefaultParticipant(
        `${MEETING_PLANNER_TEXT.DEFAULT_PARTICIPANT_NAME_PREFIX} ${counter}`,
        TIMEZONES[(counter - 1) % TIMEZONES.length].id
      );
      return [...prev, newParticipant];
    });
  }, []);

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
    addParticipant,
    getExportText,
    meetingSlots,
    optimalSlots,
    participants,
    removeParticipant,
    selectedSlot: validatedSelectedSlot,
    selectSlot,
    topSuggestions,
    updateParticipant,
  };
};
