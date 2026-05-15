import { db } from './db';

/**
 * Updates a user's login streak.
 * Should be called whenever a user logs in.
 */
export async function updateStreak(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const streak = await db.user_streak.findUnique({
    where: { user_id: userId },
  });

  // If no streak record exists, create one
  if (!streak) {
    return await db.user_streak.create({
      data: {
        user_id: userId,
        current_streak: 1,
        best_streak: 1,
        last_login_date: today,
      },
    });
  }

  // If they already logged in today, do nothing
  if (streak.last_login_date) {
    const lastLogin = new Date(streak.last_login_date);
    lastLogin.setHours(0, 0, 0, 0);
    
    if (lastLogin.getTime() === today.getTime()) {
      return streak;
    }

    const diffTime = today.getTime() - lastLogin.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day login - increment streak
      const newStreak = streak.current_streak + 1;
      const bestStreak = Math.max(newStreak, streak.best_streak);
      
      return await db.user_streak.update({
        where: { user_id: userId },
        data: {
          current_streak: newStreak,
          best_streak: bestStreak,
          last_login_date: today,
        },
      });
    } else {
      // Missed one or more days - reset streak
      // TODO: Check for streak freeze items here
      return await db.user_streak.update({
        where: { user_id: userId },
        data: {
          current_streak: 1,
          last_login_date: today,
        },
      });
    }
  } else {
    // Should not happen if record exists, but for safety:
    return await db.user_streak.update({
      where: { user_id: userId },
      data: {
        current_streak: 1,
        last_login_date: today,
      },
    });
  }
}
