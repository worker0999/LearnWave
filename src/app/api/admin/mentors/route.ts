import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
    try {
        // Verify admin authentication
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = await verifyToken(token)
        if (!decoded || decoded.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const search = searchParams.get('search')
        const branch = searchParams.get('branch')

        // Build query for users who are mentors
        const where: any = {
            role: 'MENTOR'
        }

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                {
                    user_profiles: {
                        OR: [
                            { first_name: { contains: search, mode: 'insensitive' } },
                            { last_name: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                }
            ]
        }

        if (branch && branch !== 'ALL') {
            where.user_profiles = {
                ...where.user_profiles,
                branch: branch
            }
        }



        // 1. First, find all users with role 'MENTOR' who are missing a mentor record
        // This handles "syncing" older registrations with the new approval system
        const missingMentors = await db.users.findMany({
            where: {
                role: 'MENTOR',
                mentors: null
            }
        })

        if (missingMentors.length > 0) {
            console.log(`Syncing ${missingMentors.length} mentors missing profile records...`)
            for (const user of missingMentors) {
                await db.mentors.create({
                    data: {
                        id: uuidv4(),
                        user_id: user.id,
                        approved: false,
                        hourly_rate: 0,
                        updated_at: new Date()
                    }
                })
            }
        }

        // 2. Now proceed with the standard query
        const users = await db.users.findMany({
            where,
            include: {
                mentors: true,
                user_profiles: true
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        // Filter by approval status if requested
        let filteredUsers = users
        if (status === 'PENDING') {
            filteredUsers = users.filter(u => u.mentors && !u.mentors.approved)
        } else if (status === 'APPROVED') {
            filteredUsers = users.filter(u => u.mentors && u.mentors.approved)
        }

        // Transform to the format expected by the frontend
        const mentors = filteredUsers.map(user => {
            const profile = user.user_profiles;
            const name = profile ? `${profile.first_name} ${profile.last_name}` : user.email;

            return {
                id: user.id,
                name: name,
                email: user.email,
                usn: user.usn,
                branch: profile?.branch || 'N/A',
                semester: profile?.semester,
                createdAt: user.created_at,
                mentorProfile: user.mentors ? {
                    id: user.mentors.id,
                    bio: profile?.bio || '',
                    expertise: user.mentors.expertise_areas || [],
                    experience: '0',
                    resume: user.mentors.resume_url,
                    approved: user.mentors.approved,
                    rating: Number(user.mentors.rating),
                    hourlyRate: Number(user.mentors.hourly_rate),
                    createdAt: user.mentors.created_at
                } : null
            }
        }).filter(m => m.mentorProfile !== null)

        return NextResponse.json({
            success: true,
            mentors
        })

    } catch (error) {
        console.error('Admin fetch mentors error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
