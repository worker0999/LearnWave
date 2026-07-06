export interface LevelReward {
  level: number;
  title: string;              // e.g. "Rising Scholar"
  frameKey?: string;          // references a `frame` row's `unlock_value`-matched key
  bonusMessage?: string;      // shown in the level-up toast
}

export const LEVEL_REWARDS: LevelReward[] = [
  { level: 1,  title: 'Newcomer' },
  { level: 5,  title: 'Rising Scholar', frameKey: 'bronze-frame' },
  { level: 10, title: 'Dedicated Learner', frameKey: 'silver-frame' },
  { level: 15, title: 'Knowledge Seeker' },
  { level: 20, title: 'Subject Expert', frameKey: 'gold-frame' },
  { level: 25, title: 'Scholar', bonusMessage: 'Unlocked: extended AI assistant session time' },
  { level: 30, title: 'Distinguished Scholar', frameKey: 'platinum-frame' },
  { level: 40, title: 'Master Learner', frameKey: 'diamond-frame' },
  { level: 50, title: 'LearnWave Legend', frameKey: 'legendary-frame', bonusMessage: 'Maximum level reached!' },
];

export function rewardsForLevel(level: number): LevelReward | undefined {
  return LEVEL_REWARDS.find(r => r.level === level);
}

export function currentTitleForLevel(level: number): string {
  // highest title at or below current level
  const eligible = LEVEL_REWARDS.filter(r => r.level <= level);
  return eligible[eligible.length - 1]?.title ?? 'Newcomer';
}
