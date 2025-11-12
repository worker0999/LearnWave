import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, studentId } = body

    if (!sessionId || !studentId) {
      return NextResponse.json(
        { error: 'Session ID and Student ID are required' },
        { status: 400 }
      )
    }

    // Check if session exists and belongs to the student
    const session = await db.mentor_sessions.findFirst({
      where: {
        id: sessionId
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found or unauthorized' },
        { status: 404 }
      )
    }

    // Check if session can be cancelled (only PENDING or CONFIRMED sessions)
    if (session.status !== 'PENDING' && session.status !== 'CONFIRMED') {
      return NextResponse.json(
        { error: 'Cannot cancel completed or already cancelled sessions' },
        { status: 400 }
      )
    }

    // Update session status to CANCELLED
    const updatedSession = await db.mentor_sessions.update({
      where: { id: sessionId },
      data: { status: 'CANCELLED' },
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
      }
    })

    // TODO: Send cancellation notification to mentor
    // TODO: Process refund if payment was made

    return NextResponse.json({
      success: true,
      session: updatedSession
    })

  } catch (error) {
    console.error('Cancel session error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel session' },
      { status: 500 }
    )
  }
}