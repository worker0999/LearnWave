import { getTokenFromRequest } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const announcements = await db.announcements.findMany({
      where: {
        is_active: true,
        target_roles: {
          has: 'STUDENT'
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 10,
      select: {
        id: true,
        title: true,
        content: true,
        priority: true,
        created_at: true,
      }
    });

    // Format for consistent UI
    const formattedAnnouncements = announcements.map((a: any) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      type: a.priority,
      createdAt: a.created_at,
      author: {
        name: 'Admin',
        role: 'ADMIN'
      }
    }));

    return NextResponse.json({ announcements: formattedAnnouncements });
  } catch (error) {
    console.error('Announcements fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
