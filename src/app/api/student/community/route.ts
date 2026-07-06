import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const token = getTokenFromRequest(req)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = await verifyToken(token)
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const tag = searchParams.get('tag');

        const posts = await db.community_posts.findMany({
            where: tag ? {
                tags: {
                    has: tag
                }
            } : {},
            orderBy: {
                created_at: 'desc'
            },
            include: {
                users: {
                    select: {
                        user_profiles: {
                            select: {
                                first_name: true,
                                last_name: true,
                                branch: true,
                                semester: true
                            }
                        }
                    }
                }
            }
        });

        const formattedPosts = posts.map((p) => {
            const firstName = p.users?.user_profiles?.first_name || 'Anonymous';
            const lastName = p.users?.user_profiles?.last_name || '';
            const fullName = `${firstName} ${lastName}`.trim();
            const branch = p.users?.user_profiles?.branch || 'General';
            const semester = p.users?.user_profiles?.semester;
            const roleLabel = p.role === 'MENTOR' ? 'Mentor' : 'Student';
            const detailsLabel = semester ? `${roleLabel} · ${branch} · Sem ${semester}` : `${roleLabel} · ${branch}`;

            const initials = fullName.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);

            return {
                id: p.id,
                author: fullName,
                role: detailsLabel,
                avatar: p.avatar || initials,
                content: p.content,
                likes: p.likes,
                comments: p.comments,
                time: getRelativeTime(p.created_at),
                tags: p.tags
            };
        });

        return NextResponse.json({ posts: formattedPosts });
    } catch (error) {
        console.error('Community posts fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

function getRelativeTime(date: Date) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
}
