import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(request)

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: resourceId } = await params

    // Check if resource exists
    const resource = await db.resources.findUnique({
      where: { id: resourceId }
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Increment download count
    await db.resources.update({
      where: { id: resourceId },
      data: {
        downloadCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Download count updated'
    })

  } catch (error) {
    console.error('Error updating download count:', error)
    return NextResponse.json(
      { error: 'Failed to update download count' },
      { status: 500 }
    )
  }
}