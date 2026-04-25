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
            where: { user_id: userId }
        })

        if (!mentor) {
            return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
        }

        // 2. Fetch unique students who have booked with this mentor
        const bookings = await db.bookings.findMany({
            where: {
                mentor_id: mentor.id
            },
            include: {
                users: { // This is the student
                    include: {
                        user_profiles: true
                    }
                }
            },
            orderBy: {
                scheduled_at: 'desc'
            }
        })

        // 3. Group by student to get unique list and aggregated data
        const studentMap = new Map()

        bookings.forEach(booking => {
            const studentId = booking.student_id
            if (!studentMap.has(studentId)) {
                const profile = booking.users.user_profiles
                studentMap.set(studentId, {
                    id: studentId,
                    name: profile ? `${profile.first_name} ${profile.last_name}` : booking.users.email,
                    email: booking.users.email,
                    totalSessions: 0,
                    lastSession: booking.scheduled_at,
                    status: 'active' // Defaulting to active if they have bookings
                })
            }

            const studentData = studentMap.get(studentId)
            studentData.totalSessions += 1
            if (new Date(booking.scheduled_at) > new Date(studentData.lastSession)) {
                studentData.lastSession = booking.scheduled_at
            }
        })

        const transformedStudents = Array.from(studentMap.values())

        return NextResponse.json({
            success: true,
            students: transformedStudents
        })

    } catch (error) {
        console.error('Mentor students fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch students' },
            { status: 500 }
        )
    }
}
