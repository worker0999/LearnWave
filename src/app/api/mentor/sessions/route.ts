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
        const mentor = await db.mentors.findUnique({
            where: { id: userId } // In this schema, it seems mentors.id might be linked to users.id OR we query by users.id
        })

        // Fallback: search by user_id if the direct ID doesn't match
        const actualMentor = mentor || await db.mentors.findFirst({
            where: { user_id: userId }
        })

        if (!actualMentor) {
            return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
        }

        // 2. Fetch bookings for this mentor
        const bookings = await db.bookings.findMany({
            where: {
                mentor_id: actualMentor.id
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

        // 3. Transform for the mentor dashboard
        const transformedSessions = bookings.map(booking => {
            const studentProfile = booking.users.user_profiles
            const studentName = studentProfile ? `${studentProfile.first_name} ${studentProfile.last_name}` : booking.users.email

            return {
                id: booking.id,
                studentName: studentName,
                date: booking.scheduled_at,
                time: booking.scheduled_at,
                duration: booking.duration_minutes,
                status: booking.status.toLowerCase(),
                topic: booking.mentor_sessions.title,
                meetingLink: booking.meeting_link
            }
        })

        return NextResponse.json({
            success: true,
            sessions: transformedSessions
        })

    } catch (error) {
        console.error('Mentor sessions fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch sessions' },
            { status: 500 }
        )
    }
}

// Handler for approving/rejecting sessions
export async function PATCH(request: NextRequest) {
    try {
        const token = getTokenFromHeaders(request.headers)
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const decoded = await verifyToken(token)

        const body = await request.json()
        const { sessionId, status, meetingLink } = body

        if (!sessionId || !status) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        let dbStatus = status.toUpperCase()
        if (dbStatus === 'REJECTED') {
            dbStatus = 'CANCELLED'
        }

        const updatedBooking = await db.bookings.update({
            where: { id: sessionId },
            data: {
                status: dbStatus as any,
                meeting_link: meetingLink,
                updated_at: new Date()
            }
        })

        return NextResponse.json({
            success: true,
            message: `Session ${status.toLowerCase()} successfully`,
            booking: updatedBooking
        })

    } catch (error) {
        console.error('Update session error:', error)
        return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
    }
}
