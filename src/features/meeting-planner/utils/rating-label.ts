import type { MeetingRating } from '@/types';

export const getMeetingRatingLabel = (rating: MeetingRating): string => {
  const labels: Record<MeetingRating, string> = {
    excellent: '✅ Perfect',
    good: '👍 Good',
    acceptable: '⚠️ Acceptable',
    poor: '❌ Not suitable',
  };

  return labels[rating];
};
