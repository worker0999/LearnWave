import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function PUT(req: NextRequest) {
    try {
        // Get token from Authorization header
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

        const { name, email, phone } = await req.json();

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
                        },
                        update: {
                            first_name: firstName,
                            last_name: lastName,
                            phone: phone || null,
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
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({
            error: 'Failed to update profile',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
