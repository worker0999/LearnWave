import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (type && type !== 'ALL') {
      where.target_roles = {
        has: type === 'STUDENTS' ? 'STUDENT' : (type === 'MENTORS' ? 'MENTOR' : type)
      }
    }

    // Get announcements with pagination
    const [announcements, totalCount] = await Promise.all([
      db.announcements.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      db.announcements.count({ where })
    ])

    return NextResponse.json({
      success: true,
      announcements,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Get announcements error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const { title, content, type, priority } = body

    // Validate required fields
    if (!title || !content || !type) {
      return NextResponse.json(
        { error: 'Title, content, and type are required' },
        { status: 400 }
      )
    }

    // Map type to target roles
    let targetRoles: string[] = []
    if (type === 'STUDENTS') targetRoles = ['STUDENT']
    else if (type === 'MENTORS') targetRoles = ['MENTOR']
    else if (type === 'ALL') targetRoles = ['STUDENT', 'MENTOR']
    
    // Default expiration is 7 days from now if not specified
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Create announcement
    const announcement = await db.announcements.create({
      data: {
        id: uuidv4(),
        title,
        content,
        target_roles: targetRoles as any,
        priority: priority || 'MEDIUM',
        is_active: true,
        expires_at: expiresAt,
        created_by: decoded.userId,
        updated_at: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Announcement created successfully',
      announcement
    })

  } catch (error) {
    console.error('Create announcement error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const announcementId = searchParams.get('id')

    if (!announcementId) {
      return NextResponse.json(
        { error: 'Announcement ID is required' },
        { status: 400 }
      )
    }

    // Check if announcement exists
    const announcement = await db.announcements.findUnique({
      where: { id: announcementId }
    })

    if (!announcement) {
      return NextResponse.json(
        { error: 'Announcement not found' },
        { status: 404 }
      )
    }

    // Delete announcement
    await db.announcements.delete({
      where: { id: announcementId }
    })

    return NextResponse.json({
      success: true,
      message: 'Announcement deleted successfully'
    })

  } catch (error) {
    console.error('Delete announcement error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
