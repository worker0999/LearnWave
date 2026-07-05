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

        const { name, email, phone, avatarUrl } = await req.json();

        // Split name into first and last name
        const [firstName = '', ...lastNameParts] = name.split(' ');
        const lastName = lastNameParts.join(' ');

        // Update user and user profile
        // We update email on users table and name/phone on user_profiles table
        const updatedUser = await db.users.update({
            where: { id: userId },
            data: {
                ...(email && { email }),
                user_profiles: {
                    upsert: {
                        create: {
                            first_name: firstName,
                            last_name: lastName,
                            phone: phone || null,
                            ...(avatarUrl !== undefined && { avatar_url: avatarUrl }),
                        },
                        update: {
                            first_name: firstName,
                            last_name: lastName,
                            phone: phone || null,
                            ...(avatarUrl !== undefined && { avatar_url: avatarUrl }),
                        }
                    }
                }
            },
            include: {
                user_profiles: true
            }
        });

        return NextResponse.json({
            user: {
                id: updatedUser.id,
                name: `${updatedUser.user_profiles?.first_name} ${updatedUser.user_profiles?.last_name}`.trim(),
                email: updatedUser.email,
                phone: updatedUser.user_profiles?.phone,
                usn: updatedUser.usn,
                role: updatedUser.role,
                avatarUrl: updatedUser.user_profiles?.avatar_url || null
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({
            error: 'Failed to update profile'
        }, { status: 500 });
    }
}
