import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = await verifyToken(token)
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const body = await request.json()
        const { mentorId, scheduledAt, durationMinutes = 60 } = body

        if (!mentorId || !scheduledAt) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Get mentor details and their hourly rate
        const mentor = await db.mentors.findUnique({
            where: { id: mentorId }
        })

        if (!mentor) {
            return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
        }

        // 2. Find or create a default mentor_session for this mentor
        // We need this because the bookings table requires a mentor_session_id
        let session = await db.mentor_sessions.findFirst({
            where: { mentor_id: mentorId, is_active: true }
        })

        if (!session) {
            session = await db.mentor_sessions.create({
                data: {
                    id: uuidv4(),
                    mentor_id: mentorId,
                    title: 'General Mentorship Session',
                    description: 'One-on-one mentoring session',
                    duration_minutes: durationMinutes,
                    price: mentor.hourly_rate,
                    session_type: 'ONE_ON_ONE',
                    updated_at: new Date()
                }
            })
        }

        // 3. Create the booking
        const booking = await db.bookings.create({
            data: {
                id: uuidv4(),
                student_id: decoded.userId as string,
                mentor_id: mentorId,
                mentor_session_id: session.id,
                scheduled_at: new Date(scheduledAt),
                duration_minutes: durationMinutes,
                price: mentor.hourly_rate,
                status: 'PENDING',
                updated_at: new Date()
            }
        })

        // 4. Create or get existing chat room between student and mentor
        const studentId = decoded.userId as string
        const mentorUserId = mentor.user_id

        const existingRoom = await db.chat_rooms.findFirst({
            where: {
                participant_ids: {
                    hasEvery: [studentId, mentorUserId]
                },
                type: 'SESSION'
            }
        })

        if (!existingRoom) {
            await db.chat_rooms.create({
                data: {
                    id: uuidv4(),
                    name: `Chat with ${mentor.user_id}`, // UI will handle display names
                    type: 'SESSION',
                    participant_ids: [studentId, mentorUserId],
                    created_by: studentId,
                    created_at: new Date()
                }
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Booking request sent successfully!',
            booking
        })

    } catch (error) {
        console.error('Booking error:', error)
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        )
    }
}
