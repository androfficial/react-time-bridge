/**
 * Custom hook for Meeting Planner state and logic
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Participant } from '@/types';

import {
  DEFAULT_WORKING_HOURS,
  findTimezoneById,
  TIMEZONES,
} from '@/constants';
import {
  calculateMeetingSlots,
  findOptimalSlots,
  generateParticipantId,
  getTopSuggestions,
  getUserTimezone,
} from '@/utils';

const STORAGE_KEY = 'time-bridge-participants';

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
  const userTimezone = getUserTimezone();
  const found = findTimezoneById(userTimezone);
  return found ? userTimezone : 'America/New_York';
};

/**
 * Load participants from localStorage
 */
const loadParticipants = (): Participant[] | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
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

  // Export meeting results to text
  const exportToText = useCallback(() => {
    const lines: string[] = [
      '=== Time Bridge Meeting Planner ===',
      '',
      `Generated: ${new Date().toLocaleString()}`,
      '',
      '--- Participants ---',
    ];

    participants.forEach((p) => {
      lines.push(
        `• ${p.name} (${p.timezone.name}, ${p.timezone.abbreviation})`
      );
      lines.push(
        `  Working hours: ${p.workingHours.start}:00 - ${p.workingHours.end}:00`
      );
    });

    lines.push('');
    lines.push('--- Optimal Meeting Times (UTC) ---');

    if (optimalSlots.length > 0) {
      optimalSlots.forEach((slot) => {
        const localTimes = participants
          .map((p) => {
            const localHour =
              (slot.utcHour + parseInt(p.timezone.offset.split(':')[0]) + 24) %
              24;
            return `${p.name}: ${localHour.toString().padStart(2, '0')}:00`;
          })
          .join(', ');
        lines.push(`• ${slot.utcHour.toString().padStart(2, '0')}:00 UTC`);
        lines.push(`  Local times: ${localTimes}`);
      });
    } else {
      lines.push(
        'No optimal times found where all participants are available.'
      );
    }

    const text = lines.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-times-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [participants, optimalSlots]);

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
    exportToText,
  };
};
