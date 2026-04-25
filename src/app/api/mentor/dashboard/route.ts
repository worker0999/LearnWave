import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromHeaders, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const token = getTokenFromHeaders(request.headers)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = await verifyToken(token)
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const userId = decoded.userId as string

        // 1. Get the mentor record for this user
        const mentor = await db.mentors.findFirst({
            where: { user_id: userId },
            include: {
                users: {
                    include: {
                        user_profiles: true
                    }
                }
            }
        })

        if (!mentor) {
            return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
        }

        // 2. Fetch bookings for this mentor
        const bookings = await db.bookings.findMany({
            where: {
                mentor_id: mentor.id
            },
            include: {
                users: { // This is the student
                    include: {
                        user_profiles: true
                    }
                },
                mentor_sessions: true
            },
            orderBy: {
                scheduled_at: 'desc'
            }
        })

        // 3. Aggregate earnings and session stats
        const totalEarnings = bookings
            .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
            .reduce((acc, curr) => acc + Number(curr.price), 0)

        const upcomingSessions = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED').length
        const totalSessions = bookings.length

        // Unique students
        const studentIds = new Set(bookings.map(b => b.student_id))

        // Transform bookings for the dashboard
        const transformedSessions = bookings.slice(0, 5).map(booking => {
            const studentProfile = booking.users.user_profiles
            const studentName = studentProfile ? `${studentProfile.first_name} ${studentProfile.last_name}` : booking.users.email

            return {
                id: booking.id,
                studentName: studentName,
                title: booking.mentor_sessions.title,
                scheduledAt: booking.scheduled_at,
                duration: booking.duration_minutes,
                price: Number(booking.price),
                status: booking.status
            }
        })

        return NextResponse.json({
            success: true,
            mentorData: {
                name: mentor.users.user_profiles ? `${mentor.users.user_profiles.first_name} ${mentor.users.user_profiles.last_name}` : mentor.users.email,
                email: mentor.users.email,
                expertise: mentor.expertise_areas || [],
                rating: Number(mentor.rating) || 4.5,
                hourlyRate: Number(mentor.hourly_rate),
                totalSessions: totalSessions,
                totalEarnings: totalEarnings,
                upcomingSessions: upcomingSessions,
                totalStudents: studentIds.size
            },
            recentSessions: transformedSessions
        })

    } catch (error) {
        console.error('Mentor dashboard fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        )
    }
}
