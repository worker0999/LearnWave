import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { xpForLevel } from '@/lib/xp-config';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Fetch all gamification data for the user
    const [progress, streak, achievementsCount, equippedAvatar, latestRank] = await Promise.all([
      db.user_progress.findUnique({ where: { user_id: userId } }),
      db.user_streak.findUnique({ where: { user_id: userId } }),
      db.user_achievement.count({ where: { user_id: userId } }),
      db.user_avatar.findFirst({ 
        where: { user_id: userId, equipped: true }, 
        include: { avatars: true } 
      }),
      db.leaderboard_entry.findFirst({ 
        where: { user_id: userId }, 
        orderBy: { created_at: 'desc' } 
      })
    ]);

    const currentXp = progress?.xp || 0;
    const currentLevel = progress?.level || 1;
    const nextLevelXp = xpForLevel(currentLevel + 1);
    const currentLevelStartXp = xpForLevel(currentLevel);
    
    // Calculate progress within current level
    const xpInCurrentLevel = currentXp - currentLevelStartXp;
    const xpNeededForNextLevel = nextLevelXp - currentLevelStartXp;
    const levelProgress = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

    return NextResponse.json({
      progress: {
        xp: currentXp,
        level: currentLevel,
        totalXpEarned: progress?.total_xp_earned || 0,
        nextLevelXp,
        levelProgress: Math.min(100, Math.max(0, levelProgress)),
      },
      streak: {
        current: streak?.current_streak || 0,
        best: streak?.best_streak || 0,
      },
      achievementsCount,
      equippedAvatar: equippedAvatar?.avatars || null,
      rank: latestRank?.rank || null,
    });
  } catch (error) {
    console.error('Gamification progress API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch gamification progress',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
