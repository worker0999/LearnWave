import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
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
            error: 'Failed to change password'
        }, { status: 500 });
    }
}
