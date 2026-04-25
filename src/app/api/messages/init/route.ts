import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromHeaders, verifyToken } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
    try {
        const token = getTokenFromHeaders(request.headers)
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const decoded = await verifyToken(token)
        if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { userId } = decoded
        const { targetUserId } = await request.json()

        if (!targetUserId) {
            return NextResponse.json({ error: 'Target User ID is required' }, { status: 400 })
        }

        // Check if room exists
        let room = await db.chat_rooms.findFirst({
            where: {
                participant_ids: {
                    hasEvery: [userId, targetUserId]
                },
                type: 'SESSION'
            }
        })

        if (!room) {
            room = await db.chat_rooms.create({
                data: {
                    id: uuidv4(),
                    name: `Chat between ${userId} and ${targetUserId}`,
                    type: 'SESSION',
                    participant_ids: [userId, targetUserId],
                    created_by: userId,
                    created_at: new Date()
                }
            })
        }

        return NextResponse.json({
            success: true,
            roomId: room.id
        })

    } catch (error) {
        console.error('Initialize chat error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
