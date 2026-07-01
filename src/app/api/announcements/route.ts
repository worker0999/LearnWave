import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromHeaders, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeaders(request.headers)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const decoded = await verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const userRole = decoded.role

    // Fetch active announcements targeted to this user's role
    const announcements = await db.announcements.findMany({
      where: {
        is_active: true,
        expires_at: {
          gt: new Date()
        },
        target_roles: {
          has: userRole as any
        }
      },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json({ announcements })

  } catch (error) {
    console.error('Fetch announcements error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
