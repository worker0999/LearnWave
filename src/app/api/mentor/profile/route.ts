import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        const userId = decoded.userId as string;

        const mentor = await db.mentors.findFirst({
            where: { user_id: userId },
            include: {
                users: {
                    include: {
                        user_profiles: true
                    }
                }
            }
        });

        if (!mentor) return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });

        return NextResponse.json({
            success: true,
            profile: {
                id: mentor.id,
                name: mentor.users.user_profiles ? `${mentor.users.user_profiles.first_name} ${mentor.users.user_profiles.last_name}` : mentor.users.email,
                email: mentor.users.email,
                avatar: mentor.users.user_profiles?.avatar_url,
                bio: mentor.users.user_profiles?.bio || '',
                specialization: mentor.expertise_areas?.[0] || '',
                experience: 0,
                hourlyRate: Number(mentor.hourly_rate),
                skills: mentor.expertise_areas || [],
                timezone: 'UTC',
                availability: {
                    monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false
                },
                socials: {
                    linkedin: '', github: '', twitter: ''
                }
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = await verifyToken(token);
        if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        const userId = decoded.userId as string;
        const body = await request.json();

        // 1. Get mentor
        const mentor = await db.mentors.findFirst({ where: { user_id: userId } });
        if (!mentor) return NextResponse.json({ error: 'Mentor not found' }, { status: 404 });

        // 2. Update Mentor table
        await db.mentors.update({
            where: { id: mentor.id },
            data: {
                hourly_rate: Number(body.hourlyRate),
                expertise_areas: body.skills
            }
        });

        // 3. Update Profile table
        const [firstName = '', ...lastNameParts] = body.name.split(' ');
        const lastName = lastNameParts.join(' ');

        await db.user_profiles.upsert({
            where: { user_id: userId },
            update: {
                first_name: firstName,
                last_name: lastName,
                bio: body.bio
            },
            create: {
                user_id: userId,
                first_name: firstName,
                last_name: lastName,
                bio: body.bio
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
