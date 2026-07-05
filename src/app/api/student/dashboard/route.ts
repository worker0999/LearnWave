import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        let userId: string | null = null;
        let email: string | null = null;

        const token = getTokenFromRequest(req);
        if (token) {
            const decoded = await verifyToken(token);
            if (decoded) {
                userId = decoded.userId;
                email = decoded.email;
            }
        }

        if (!userId && !email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await db.users.findUnique({
            where: userId ? { id: userId } : { email: email! },
            include: {
                user_profiles: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Map database user to UI user format
        const formattedUser = {
            id: user.id,
            name: user.user_profiles ? `${user.user_profiles.first_name} ${user.user_profiles.last_name}`.trim() : 'Student',
            email: user.email,
            usn: user.usn,
            branch: user.user_profiles?.branch || 'N/A',
            semester: user.user_profiles?.semester || 0,
            role: user.role,
        };

        // Get student stats
        const stats = {
            studyStreak: 7, // TODO: Calculate from activity tracking
            avgScore: 85, // TODO: Calculate from quiz results
            completedQuizzes: 12, // TODO: Count from quiz_attempts
            enrolledSubjects: 6, // TODO: Count from subject enrollments
        };

        return NextResponse.json({
            user: formattedUser,
            stats
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
