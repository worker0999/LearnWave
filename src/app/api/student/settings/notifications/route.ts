import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function PUT(req: NextRequest) {
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
            error: 'Failed to update settings',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
