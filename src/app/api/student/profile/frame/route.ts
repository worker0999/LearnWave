import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { db } from '@/lib/db'

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

    // Get all unlocked frames for this user
    const unlocked = await db.user_cosmetic.findMany({
      where: { user_id: decoded.userId, cosmetics: { type: 'FRAME' } },
      include: { cosmetics: true }
    })

    return NextResponse.json({ success: true, frames: unlocked })
  } catch (error) {
    console.error('Frame fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    const { frameKey } = await request.json()

    // If equipping a specific frame (frameKey is null/empty means unequip)
    if (frameKey) {
      const cosmetic = await db.cosmetic_item.findUnique({
        where: { key: frameKey }
      })

      if (!cosmetic) {
        return NextResponse.json({ error: 'Frame not found' }, { status: 404 })
      }

      // Verify the user has unlocked this frame
      const unlocked = await db.user_cosmetic.findUnique({
        where: {
          user_id_cosmetic_id: {
            user_id: decoded.userId,
            cosmetic_id: cosmetic.id
          }
        }
      })

      if (!unlocked) {
        return NextResponse.json({ error: 'Frame not unlocked' }, { status: 403 })
      }

      // Set all other frames to equipped: false, and this one to true
      await db.user_cosmetic.updateMany({
        where: { user_id: decoded.userId, cosmetics: { type: 'FRAME' } },
        data: { equipped: false }
      })

      await db.user_cosmetic.update({
        where: { id: unlocked.id },
        data: { equipped: true }
      })
    } else {
      // Unequip all frames
      await db.user_cosmetic.updateMany({
        where: { user_id: decoded.userId, cosmetics: { type: 'FRAME' } },
        data: { equipped: false }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Frame equip error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
