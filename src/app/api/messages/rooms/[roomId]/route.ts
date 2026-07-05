import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { roomId } = await params
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = await verifyToken(token)
        if (!decoded) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { userId } = decoded

        // Verify user is a participant in the room
        const room = await db.chat_rooms.findUnique({
            where: { id: roomId }
        })

        if (!room || !room.participant_ids.includes(userId)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Fetch messages for the room
        const messages = await db.chat_messages.findMany({
            where: {
                room_id: roomId
            },
            include: {
                users: {
                    include: {
                        user_profiles: true
                    }
                }
            },
            orderBy: {
                created_at: 'asc'
            }
        })

        const transformedMessages = messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            timestamp: msg.created_at,
            sender: {
                id: msg.sender_id,
                name: msg.users.user_profiles
                    ? `${msg.users.user_profiles.first_name} ${msg.users.user_profiles.last_name}`
                    : msg.users.email,
                avatar: msg.users.user_profiles?.avatar_url || null
            }
        }))

        return NextResponse.json({
            success: true,
            messages: transformedMessages
        })

    } catch (error) {
        console.error('Fetch messages error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
