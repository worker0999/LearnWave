import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const userId = decoded.userId;

    const now = new Date();

    // Fetch active missions and the user's progress
    const [activeMissions, userMissions] = await Promise.all([
      db.mission.findMany({
        where: {
          OR: [
            { active_from: null, active_to: null },
            {
              active_from: { lte: now },
              active_to: { gte: now }
            }
          ]
        }
      }),
      db.user_mission.findMany({ where: { user_id: userId } })
    ]);

    const progressMap = new Map<string, typeof userMissions[number]>(
      userMissions.map(um => [um.mission_id, um])
    );

    const missions = activeMissions.map(m => {
      const progress = progressMap.get(m.id);
      return {
        ...m,
        currentValue: progress?.progress || 0,
        isCompleted: progress?.completed || false
      };
    });

    return NextResponse.json({ missions });
  } catch (error) {
    console.error('Missions API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
