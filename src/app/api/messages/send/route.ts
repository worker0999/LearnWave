import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = await verifyToken(token)
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { userId } = decoded
        const { roomId, content, type = 'TEXT' } = await request.json()

        if (!roomId || !content) {
            return NextResponse.json({ error: 'Room ID and content are required' }, { status: 400 })
        }

        // Verify user is a participant in the room
        const room = await db.chat_rooms.findUnique({
            where: { id: roomId }
        })

        if (!room || !room.participant_ids.includes(userId)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Create the message
        const message = await db.chat_messages.create({
            data: {
                id: uuidv4(),
                room_id: roomId,
                sender_id: userId,
                content,
                message_type: type,
                created_at: new Date()
            },
            include: {
                users: {
                    include: {
                        user_profiles: true
                    }
                }
            }
        })

        const transformedMessage = {
            id: message.id,
            content: message.content,
            timestamp: message.created_at,
            sender: {
                id: message.sender_id,
                name: message.users.user_profiles
                    ? `${message.users.user_profiles.first_name} ${message.users.user_profiles.last_name}`
                    : message.users.email,
                avatar: message.users.user_profiles?.avatar_url || null
            }
        }

        return NextResponse.json({
            success: true,
            message: transformedMessage
        })

    } catch (error) {
        console.error('Send message error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
