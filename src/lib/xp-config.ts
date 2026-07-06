export const XP_RULES = {
  LOGIN: { xp: 10, dailyCap: 1 },
  QUIZ_COMPLETED: { xp: 50, dailyCap: null },
  QUIZ_SCORE_90: { xp: 30, dailyCap: null },
  WATCH_VIDEO: { xp: 25, dailyCap: 5 },
  FORUM_POST: { xp: 10, dailyCap: 5 },
  ANSWER_ACCEPTED: { xp: 40, dailyCap: null },
  ASSIGNMENT_SUBMITTED: { xp: 80, dailyCap: 1 },
} as const;

export type ActionType = keyof typeof XP_RULES;

/**
 * Level formula: level = floor(sqrt(xp / 100)) + 1
 * Level 1: 0 XP
 * Level 2: 100 XP
 * Level 3: 400 XP
 * Level 4: 900 XP
 * Level 5: 1600 XP
 */
export const MAX_LEVEL = 50;

export const calculateLevel = (xp: number) => {
  const rawLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
  return Math.min(rawLevel, MAX_LEVEL);
};

/**
 * Returns the XP required for a specific level
 */
export const xpForLevel = (level: number) => Math.pow(level - 1, 2) * 100;
