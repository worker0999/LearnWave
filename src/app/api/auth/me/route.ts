import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const user = await db.users.findUnique({
      where: { id: decoded.userId },
      include: {
        user_profiles: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const name = user.user_profiles
      ? `${user.user_profiles.first_name} ${user.user_profiles.last_name}`.trim()
      : 'User'

    const responseUser = {
      id: user.id,
      email: user.email,
      name: name,
      role: user.role,
      usn: user.usn,
      branch: user.user_profiles?.branch,
      semester: user.user_profiles?.semester,
      avatarUrl: user.user_profiles?.avatar_url || null
    }

    return NextResponse.json({
      user: responseUser,
      token
    })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
