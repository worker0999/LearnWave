import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromHeaders, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const token = getTokenFromHeaders(request.headers)
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const decoded = await verifyToken(token)
        if (!decoded || decoded.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const bookings = await db.bookings.findMany({
            include: {
                users: { // Student
                    include: {
                        user_profiles: true
                    }
                },
                mentors: {
                    include: {
                        users: {
                            include: {
                                user_profiles: true
                            }
                        }
                    }
                },
                mentor_sessions: true
            },
            orderBy: {
                scheduled_at: 'desc'
            }
        })

        const sessions = bookings.map(b => ({
            id: b.id,
            studentName: b.users.user_profiles ? `${b.users.user_profiles.first_name} ${b.users.user_profiles.last_name}` : b.users.email,
            mentorName: b.mentors.users.user_profiles ? `${b.mentors.users.user_profiles.first_name} ${b.mentors.users.user_profiles.last_name}` : b.mentors.users.email,
            topic: b.mentor_sessions.title,
            scheduledAt: b.scheduled_at,
            status: b.status,
            meetingLink: b.meeting_link,
            price: b.price
        }))

        return NextResponse.json({ success: true, sessions })

    } catch (error) {
        console.error('Admin sessions fetch error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const token = getTokenFromHeaders(request.headers)
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const decoded = await verifyToken(token)
        if (!decoded || decoded.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { sessionId, meetingLink, status } = body

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
        }

        const updateData: any = {}
        if (meetingLink !== undefined) updateData.meeting_link = meetingLink
        if (status !== undefined) updateData.status = status

        const updated = await db.bookings.update({
            where: { id: sessionId },
            data: {
                ...updateData,
                updated_at: new Date()
            }
        })

        return NextResponse.json({ success: true, session: updated })

    } catch (error) {
        console.error('Admin session update error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
