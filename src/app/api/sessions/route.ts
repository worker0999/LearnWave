import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    
    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      )
    }
    
    const sessions = await db.mentor_sessions.findMany({
      where: {
        mentor_id: studentId
      },
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
      sessions
    })
    
  } catch (error) {
    console.error('Fetch sessions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}