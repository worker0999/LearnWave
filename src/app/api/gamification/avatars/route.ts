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

    // Fetch all avatars and the user's unlocked/equipped ones
    const [allAvatars, userAvatars] = await Promise.all([
      db.avatar.findMany({ orderBy: { rarity: 'asc' } }),
      db.user_avatar.findMany({ where: { user_id: userId } })
    ]);

    const unlockedMap = new Map<string, typeof userAvatars[number]>(
      userAvatars.map(ua => [ua.avatar_id, ua])
    );

    const avatars = allAvatars.map(av => {
      const userAv = unlockedMap.get(av.id);
      return {
        ...av,
        isUnlocked: !!userAv,
        isEquipped: userAv?.equipped || false
      };
    });

    return NextResponse.json({ avatars });
  } catch (error) {
    console.error('Avatars API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const { avatarId } = await req.json();

    // Verify user owns the avatar
    const userAv = await db.user_avatar.findUnique({
      where: {
        user_id_avatar_id: {
          user_id: userId,
          avatar_id: avatarId
        }
      }
    });

    if (!userAv) {
      return NextResponse.json({ error: 'Avatar not unlocked' }, { status: 403 });
    }

    // Unequip all and equip selected
    await db.$transaction([
      db.user_avatar.updateMany({
        where: { user_id: userId },
        data: { equipped: false }
      }),
      db.user_avatar.update({
        where: {
          user_id_avatar_id: {
            user_id: userId,
            avatar_id: avatarId
          }
        },
        data: { equipped: true }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Avatar equip API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
