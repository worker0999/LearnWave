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
    const { score, subject } = body

    if (score === undefined || !subject) {
      return NextResponse.json({ error: 'Missing score or subject' }, { status: 400 })
    }

    const results: any[] = []
    const res1 = await awardXP(decoded.userId, 'QUIZ_COMPLETED', { score, subject })
    results.push(res1)

    if (score >= 90) {
      const res2 = await awardXP(decoded.userId, 'QUIZ_SCORE_90', { score })
      results.push(res2)
    }

    const totalXp = results.reduce((sum, r) => sum + (r.success ? (r.xpGained || 0) : 0), 0)
    const lastResult = results[results.length - 1]

    return NextResponse.json({
      success: true,
      xpGained: totalXp,
      leveledUp: results.some(r => r.leveledUp),
      level: lastResult.level || 1
    })

  } catch (error) {
    console.error('Quiz submit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
