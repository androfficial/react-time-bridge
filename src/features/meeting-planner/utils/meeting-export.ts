import type { MeetingSlotResult, Participant } from '@/types';

import { formatHour, getLocalHourFromUtc } from '@/utils';

type BuildMeetingPlannerExportTextArgs = {
  now?: Date;
  optimalSlots: MeetingSlotResult[];
  participants: Participant[];
};

export const buildMeetingPlannerExportText = ({
  participants,
  optimalSlots,
  now = new Date(),
}: BuildMeetingPlannerExportTextArgs): string => {
  const referenceDate = now;

  const lines: string[] = [
    '=== Time Bridge Meeting Planner ===',
    '',
    `Generated: ${now.toLocaleString()}`,
    '',
    '--- Participants ---',
  ];

  participants.forEach((p) => {
    lines.push(`• ${p.name} (${p.timezone.name}, ${p.timezone.abbreviation})`);
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
          const localHour = getLocalHourFromUtc(
            slot.utcHour,
            p.timezone.id,
            referenceDate
          );
          return `${p.name}: ${formatHour(localHour)}`;
        })
        .join(', ');

      lines.push(`• ${slot.utcHour.toString().padStart(2, '0')}:00 UTC`);
      lines.push(`  Local times: ${localTimes}`);
    });
  } else {
    lines.push('No optimal times found where all participants are available.');
  }

  return lines.join('\n');
};

export const getMeetingPlannerExportFileName = (now = new Date()): string => {
  const yyyyMmDd = now.toISOString().split('T')[0];
  return `meeting-times-${yyyyMmDd}.txt`;
};
