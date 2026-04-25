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

        const { notifications, emailUpdates, publicProfile } = await req.json();

        // Update settings in user_settings table
        // Map the mentor-specific keys to the schema columns
        const updatedSettings = await db.user_settings.upsert({
            where: { user_id: userId },
            update: {
                push_notifications: notifications,
                email_notifications: emailUpdates,
                // Assuming publicProfile might map to a future column or we just handle it here
            },
            create: {
                user_id: userId,
                push_notifications: notifications,
                email_notifications: emailUpdates,
            }
        });

        return NextResponse.json({
            success: true,
            settings: updatedSettings
        });
    } catch (error) {
        console.error('Mentor settings update error:', error);
        return NextResponse.json({
            error: 'Failed to update settings',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

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

        const settings = await db.user_settings.findUnique({
            where: { user_id: userId }
        });

        return NextResponse.json({
            success: true,
            settings: settings || {
                email_notifications: true,
                push_notifications: true
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}
