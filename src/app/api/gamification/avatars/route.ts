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

    // Fetch all avatars and the user's unlocked/equipped ones
    const [allAvatars, userAvatars] = await Promise.all([
      db.avatar.findMany({ orderBy: { rarity: 'asc' } }),
      db.user_avatar.findMany({ where: { user_id: userId } })
    ]);

    const unlockedMap = new Map(userAvatars.map(ua => [ua.avatar_id, ua]));

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
