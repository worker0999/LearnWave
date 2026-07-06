import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { db } from '@/lib/db'
import { LEVEL_REWARDS } from '@/lib/level-rewards'

export async function PATCH(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { title } = await request.json()
    const progress = await db.user_progress.findUnique({
      where: { user_id: decoded.userId }
    })

    const allowed = LEVEL_REWARDS.some(
      (r) => r.title === title && r.level <= (progress?.level ?? 1)
    )

    if (!allowed && title !== 'Newcomer') {
      return NextResponse.json({ error: 'Title not unlocked' }, { status: 403 })
    }

    await db.user_profiles.update({
      where: { user_id: decoded.userId },
      data: { equipped_title: title }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Title equip error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
