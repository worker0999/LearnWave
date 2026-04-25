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

    // Fetch bookings for the student
    const bookings = await db.bookings.findMany({
      where: {
        student_id: userId
      },
      include: {
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

    // Transform to match frontend expectations
    const transformedBookings = bookings.map(booking => {
      const mentorProfile = booking.mentors.users.user_profiles
      const mentorName = mentorProfile ? `${mentorProfile.first_name} ${mentorProfile.last_name}` : booking.mentors.users.email

      return {
        id: booking.id,
        mentor: mentorName,
        mentorUserId: booking.mentors.user_id,
        subject: booking.mentor_sessions.title,
        date: booking.scheduled_at,
        time: booking.scheduled_at, // Use full date, frontend can format
        duration: booking.duration_minutes,
        status: booking.status.toLowerCase(),
        platform: booking.meeting_link || 'TBD'
      }
    })

    return NextResponse.json({
      success: true,
      sessions: transformedBookings
    })

  } catch (error) {
    console.error('Fetch sessions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}
