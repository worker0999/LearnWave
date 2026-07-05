import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { mentorId, action } = body

    if (!mentorId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Mentor ID and valid action (approve/reject) are required' },
        { status: 400 }
      )
    }

    // Check if user exists and is a mentor
    const mentor = await db.users.findUnique({
      where: { id: mentorId },
      include: {
        mentors: true
      }
    })

    if (!mentor || mentor.role !== 'MENTOR') {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      )
    }

    if (!mentor.mentors) {
      return NextResponse.json(
        { error: 'Mentor profile not found' },
        { status: 404 }
      )
    }

    // Update mentor approval status
    const updatedMentor = await db.mentors.update({
      where: { user_id: mentorId },
      data: {
        approved: action === 'approve',
        approved_at: action === 'approve' ? new Date() : null
      }
    })

    return NextResponse.json({
      success: true,
      message: `Mentor ${action}d successfully`,
      mentor: {
        id: mentor.id,
        email: mentor.email,
        approved: updatedMentor.approved
      }
    })

  } catch (error) {
    console.error('Mentor approval error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
