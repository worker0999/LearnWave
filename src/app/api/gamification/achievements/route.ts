import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

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

    // Fetch all achievements and the user's unlocked ones
    const [allAchievements, userAchievements] = await Promise.all([
      db.achievement.findMany({ orderBy: { rarity: 'asc' } }),
      db.user_achievement.findMany({ where: { user_id: userId } })
    ]);

    const unlockedIds = new Set(userAchievements.map(ua => ua.achievement_id));

    const achievements = allAchievements.map(ach => ({
      ...ach,
      isUnlocked: unlockedIds.has(ach.id),
      unlockedAt: userAchievements.find(ua => ua.achievement_id === ach.id)?.unlocked_at || null
    }));

    return NextResponse.json({ achievements });
  } catch (error) {
    console.error('Achievements API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
