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
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (role && role !== 'ALL') {
      where.role = role
    }
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { usn: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      db.users.findMany({
        where,
        include: {
          mentors: {
            select: {
              approved: true,
              rating: true,
              hourly_rate: true,
              expertise_areas: true
            }
          },
          bookings: true
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit
      }),
      db.users.count({ where })
    ])

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Get users error:', error)
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
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Prevent admin from deleting themselves
    if (userId === decoded.userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await db.users.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user (cascade delete will handle related records)
    await db.users.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}