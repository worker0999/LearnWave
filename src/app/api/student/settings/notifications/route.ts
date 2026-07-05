import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest) {
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

        const { emailNotifs, pushNotifs, announcementNotifs, assignmentNotifs } = await req.json();

        // Upsert user settings
        const updatedSettings = await db.user_settings.upsert({
            where: { user_id: userId },
            update: {
                email_notifications: emailNotifs,
                push_notifications: pushNotifs,
                announcement_notifications: announcementNotifs,
                assignment_notifications: assignmentNotifs
            },
            create: {
                user_id: userId,
                email_notifications: emailNotifs,
                push_notifications: pushNotifs,
                announcement_notifications: announcementNotifs,
                assignment_notifications: assignmentNotifs
            }
        });

        return NextResponse.json({ settings: updatedSettings });
    } catch (error) {
        console.error('Notification settings update error:', error);
        return NextResponse.json({
            error: 'Failed to update settings'
        }, { status: 500 });
    }
}
