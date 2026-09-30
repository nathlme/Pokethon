export interface Achievement {
  id: number;
  code: string;
  label: string;
  description?: string | null;
  threshold?: number | null;
}

export interface UserAchievement {
  id: number;
  achievement_id: number;
  unlocked_at: string;
  achievement: Achievement;
}