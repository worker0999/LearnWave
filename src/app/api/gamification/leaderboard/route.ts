import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'global'; // global, monthly, branch
    const branch = searchParams.get('branch');

    let leaderboard: any[] = [];

    if (type === 'global') {
      const entries = await db.user_progress.findMany({
        take: 10,
        orderBy: { xp: 'desc' },
        include: {
          users: {
            select: {
              id: true,
              user_profiles: {
                select: {
                  first_name: true,
                  last_name: true,
                  branch: true,
                }
              },
              user_avatars: {
                where: { equipped: true },
                include: { avatars: true }
              }
            }
          }
        }
      });
      
      leaderboard = entries.map((e: any, index: number) => ({
        rank: index + 1,
        userId: e.user_id,
        name: e.users.user_profiles ? `${e.users.user_profiles.first_name} ${e.users.user_profiles.last_name}` : 'Anonymous',
        xp: e.xp,
        level: e.level,
        branch: e.users.user_profiles?.branch,
        avatar: e.users.user_avatars[0]?.avatars?.image_url || null,
      }));

    } else if (type === 'monthly') {
      const now = new Date();
      const entries = await db.leaderboard_entry.findMany({
        where: {
          month: now.getMonth() + 1,
          year: now.getFullYear()
        },
        take: 10,
        orderBy: { xp: 'desc' },
        include: {
          users: {
            select: {
              id: true,
              user_profiles: {
                select: {
                  first_name: true,
                  last_name: true,
                  branch: true,
                }
              },
              user_avatars: {
                where: { equipped: true },
                include: { avatars: true }
              }
            }
          }
        }
      });

      leaderboard = entries.map((e: any) => ({
        rank: e.rank,
        userId: e.user_id,
        name: e.users.user_profiles ? `${e.users.user_profiles.first_name} ${e.users.user_profiles.last_name}` : 'Anonymous',
        xp: e.xp,
        branch: e.users.user_profiles?.branch,
        avatar: e.users.user_avatars[0]?.avatars?.image_url || null,
      }));

    } else if (type === 'branch' && branch) {
      const entries = await db.user_progress.findMany({
        where: {
          users: {
            user_profiles: {
              branch: branch
            }
          }
        },
        take: 10,
        orderBy: { xp: 'desc' },
        include: {
          users: {
            select: {
              id: true,
              user_profiles: {
                select: {
                  first_name: true,
                  last_name: true,
                  branch: true,
                }
              },
              user_avatars: {
                where: { equipped: true },
                include: { avatars: true }
              }
            }
          }
        }
      });

      leaderboard = entries.map((e: any, index: number) => ({
        rank: index + 1,
        userId: e.user_id,
        name: e.users.user_profiles ? `${e.users.user_profiles.first_name} ${e.users.user_profiles.last_name}` : 'Anonymous',
        xp: e.xp,
        level: e.level,
        branch: e.users.user_profiles?.branch,
        avatar: e.users.user_avatars[0]?.avatars?.image_url || null,
      }));
    }

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch leaderboard',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
