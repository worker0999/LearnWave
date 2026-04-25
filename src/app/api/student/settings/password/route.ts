import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

        const { currentPassword, newPassword } = await req.json();

        // Get user with password (mapped from password_hash in schema)
        const user = await db.users.findUnique({
            where: { id: userId },
            select: { id: true, password_hash: true }
        });

        if (!user || !user.password_hash) {
            return NextResponse.json({ error: 'User not found or password not set' }, { status: 404 });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.users.update({
            where: { id: userId },
            data: { password_hash: hashedPassword }
        });

        return NextResponse.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json({
            error: 'Failed to change password',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
