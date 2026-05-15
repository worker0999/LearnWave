import { db } from './db';
import { XP_RULES, ActionType, calculateLevel } from './xp-config';

/**
 * Awards XP to a user based on an action.
 * Handles daily caps, logging, level ups, and notifications.
 */
export async function awardXP(userId: string, action: ActionType, metadata?: any) {
  const rule = XP_RULES[action];
  if (!rule) return { success: false, reason: 'Invalid action type' };

  // 1. Check daily cap/abuse
  if (rule.dailyCap !== null) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activityCount = await db.user_activity_log.count({
      where: {
        user_id: userId,
        action_type: action,
        created_at: { gte: today },
      },
    });

    if (activityCount >= rule.dailyCap) {
      return { success: false, reason: 'Daily cap reached for this action' };
    }
  }

  // 2. Log activity
  await db.user_activity_log.create({
    data: {
      user_id: userId,
      action_type: action,
      meta_data: metadata || {},
    },
  });

  // 3. Update XP and Progress
  // We use a transaction or upsert to ensure data consistency
  const progress = await db.user_progress.upsert({
    where: { user_id: userId },
    update: {
      xp: { increment: rule.xp },
      total_xp_earned: { increment: rule.xp },
    },
    create: {
      user_id: userId,
      xp: rule.xp,
      total_xp_earned: rule.xp,
      level: 1,
    },
  });

  // 4. Check Level Up
  const newLevel = calculateLevel(progress.xp);
  let leveledUp = false;
  
  if (newLevel > progress.level) {
    leveledUp = true;
    await db.user_progress.update({
      where: { user_id: userId },
      data: { level: newLevel },
    });

    // Create notification for level up
    await db.notification.create({
      data: {
        user_id: userId,
        message: `Congratulations! You've reached Level ${newLevel}!`,
        type: 'LEVEL_UP',
      },
    });
    
    // Check for level-based achievement unlocks
    await checkAchievementUnlocks(userId, 'LEVEL', newLevel);
  }

  // 5. Check for action-based achievement unlocks
  await checkAchievementUnlocks(userId, action as any, rule.xp); // Simplified: usually check total count of actions

  return {
    success: true,
    xpGained: rule.xp,
    newXp: progress.xp,
    level: newLevel,
    leveledUp,
  };
}

/**
 * Placeholder for achievement checking logic.
 * In a real system, this would query achievement requirements and user stats.
 */
async function checkAchievementUnlocks(userId: string, type: string, value: any) {
  // TODO: Implement full achievement engine
  // This will be part of a later phase
  console.log(`Checking achievements for user ${userId} of type ${type} with value ${value}`);
}
