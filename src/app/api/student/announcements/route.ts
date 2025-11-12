import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromHeaders, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeaders(request.headers)
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const priority = searchParams.get('priority')

    let whereClause: any = {}
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (type && type !== 'all') {
      whereClause.type = type
    }
    
    if (priority && priority !== 'all') {
      whereClause.priority = priority
    }

    const announcements = await db.announcements.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      announcements: announcements.map(announcement => ({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority,
        source: 'LearnWave Admin',
        publishedAt: announcement.created_at.toISOString(),
        expiresAt: null, // Can be enhanced
        attachments: announcement.attachment_url ? [announcement.attachment_url] : [], // Can be enhanced
        read: false // Can be enhanced with read status tracking
      }))
    })

  } catch (error) {
    console.error('Error fetching student announcements:', error)
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    )
  }
}