import { toast } from "sonner";

/**
 * Utility to show beautiful gamification notifications using Sonner.
 */
export const showXPToast = (xpGained: number, action: string) => {
  toast.success(`+${xpGained} XP Earned!`, {
    description: `Action: ${action.replace(/_/g, ' ').toLowerCase()}`,
    style: {
      background: 'rgba(19, 19, 26, 0.9)',
      border: '1px solid rgba(34, 211, 238, 0.3)',
      color: '#fff',
    },
  });
};

export const showLevelUpToast = (level: number) => {
  toast.success(`LEVEL UP! 🚀`, {
    description: `Incredible! You've reached Level ${level}. Keep it up!`,
    duration: 6000,
    style: {
      background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#fff',
    },
  });
};

export const showAchievementToast = (title: string, icon: string = '🏆') => {
  toast.success(`ACHIEVEMENT UNLOCKED! ${icon}`, {
    description: `You've earned the "${title}" badge!`,
    duration: 7000,
    style: {
      background: 'linear-gradient(135deg, #92400e 0%, #78350f 100%)',
      border: '1px solid rgba(251, 191, 36, 0.4)',
      color: '#fff',
    },
  });
};
