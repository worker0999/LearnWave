import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { awardXP } from '@/lib/xp-engine'

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await req.json()
    const { title, category } = body

    if (!title || !category) {
      return NextResponse.json({ error: 'Missing title or category' }, { status: 400 })
    }

    const result = await awardXP(decoded.userId, 'FORUM_POST', { title, category })

    return NextResponse.json({
      success: result.success,
      xpGained: result.xpGained || 0,
      leveledUp: result.leveledUp || false,
      level: result.level || 1
    })

  } catch (error) {
    console.error('Community post XP error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
