import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromHeaders, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = getTokenFromHeaders(request.headers)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
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
      where.type = type
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
    const token = getTokenFromHeaders(request.headers)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
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

    // Create announcement
    const announcement = await db.announcements.create({
      data: {
        title,
        content,
        target_roles: [],
        created_by: decoded.userId
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
    const token = getTokenFromHeaders(request.headers)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
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