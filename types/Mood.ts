export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface Mood {
  id: string;
  userId: string;
  moodLevel: MoodLevel;
  notes?: string;
  createdAt: string;
}