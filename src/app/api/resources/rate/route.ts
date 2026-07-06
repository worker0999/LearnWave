import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { isRateLimited } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { resourceId, voteType } = body // voteType is 'upvote' or 'downvote'

    if (!resourceId || !['upvote', 'downvote'].includes(voteType)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    // Basic rate limit to prevent spamming votes (10 votes per min per user)
    if (isRateLimited(`rate-limit:resource-rate:${decoded.userId}`, 10, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many voting requests' }, { status: 429 })
    }

    const resource = await db.resources.findUnique({
      where: { id: resourceId }
    })

    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    const updated = await db.resources.update({
      where: { id: resourceId },
      data: {
        upvotes: voteType === 'upvote' ? { increment: 1 } : undefined,
        downvotes: voteType === 'downvote' ? { increment: 1 } : undefined
      }
    })

    return NextResponse.json({
      success: true,
      upvotes: updated.upvotes,
      downvotes: updated.downvotes
    })
  } catch (error) {
    console.error('Resource rate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
