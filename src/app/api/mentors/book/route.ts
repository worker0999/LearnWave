import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const bookingSchema = z.object({
  mentorId: z.string(),
  studentId: z.string(),
  date: z.string(),
  time: z.string(),
  duration: z.number(),
  notes: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).default('PENDING'),
  amount: z.number()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = bookingSchema.parse(body)
    
    // Check if student exists
    const student = await db.users.findUnique({
      where: { id: validatedData.studentId }
    })
    
    if (!student || student.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }
    
    // Check if mentor exists and is approved
    const mentor = await db.mentors.findUnique({
      where: { 
        user_id: validatedData.mentorId
      },
      include: {
        users: true
      }
    })
    
    if (!mentor || !mentor.approved) {
      return NextResponse.json(
        { error: 'Mentor not found or not approved' },
        { status: 404 }
      )
    }
    
    // Check for existing booking at the same time
    const existingBooking = await db.mentor_sessions.findFirst({
      where: {
        mentor_id: validatedData.mentorId
      }
    })
    
    if (existingBooking) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      )
    }
    
    // Create the booking
    const booking = await db.mentor_sessions.create({
      data: {
        mentor_id: validatedData.mentorId,
        title: `Session with ${mentor.users.email}`,
        description: validatedData.notes || '',
        duration_minutes: validatedData.duration,
        price: validatedData.amount,
        is_active: true
      },
      include: {
        mentors: {
          include: {
            users: true
          }
        }
      }
    })
    
    // TODO: Send notification emails to both mentor and student
    // TODO: Integrate with payment gateway
    
    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        mentor: {
          name: booking.mentor.user.name,
          email: booking.mentor.user.email
        },
        student: booking.student,
        date: booking.date,
        time: booking.time,
        duration: booking.duration,
        status: booking.status,
        amount: booking.amount,
        meetingLink: booking.meetingLink
      }
    })
    
  } catch (err) {
    console.error('Booking creation error:', err)

    // Narrow error for Zod
    if (err && typeof err === 'object' && 'issues' in err) {
      // z.ZodError has `issues` property; provide details if present
      const details = (err as any).issues || (err as any).errors || []
      return NextResponse.json(
        { error: 'Invalid request data', details },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const mentorId = searchParams.get('mentorId')
    const status = searchParams.get('status')
    
    // Build where clause
    const where: any = {}
    
    if (studentId) where.studentId = studentId
    if (mentorId) where.mentorId = mentorId
    if (status) where.status = status
    
    const bookings = await db.mentor_sessions.findMany({
      where,
      include: {
        mentors: {
          include: {
            users: {
              select: {
                id: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      bookings
    })
    
  } catch (error) {
    console.error('Fetch bookings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

function generateMeetingLink(): string {
  // Generate a unique meeting link (in production, integrate with Zoom/Google Meet)
  const meetingId = Math.random().toString(36).substring(2, 15)
  return `https://meet.learnwave.com/session/${meetingId}`
}