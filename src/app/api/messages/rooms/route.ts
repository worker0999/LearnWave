import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
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

        // Fetch rooms where the user is a participant
        // Note: participant_ids is a String[] in Prisma, but we might need to filter manually 
        // depending on the DB provider's support for array contains in Prisma.
        // PostgreSQL supports 'has' or 'hasEvery' or 'hasSome'.

        const rooms = await db.chat_rooms.findMany({
            where: {
                participant_ids: {
                    has: userId
                },
                is_active: true
            },
            include: {
                chat_messages: {
                    orderBy: {
                        created_at: 'desc'
                    },
                    take: 1,
                    include: {
                        users: {
                            select: {
                                email: true,
                                user_profiles: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        // Fetch participant user details for each room (excluding current user)
        const roomsWithParticipants = await Promise.all(rooms.map(async (room) => {
            const otherParticipantIds = room.participant_ids.filter(id => id !== userId)

            const otherParticipants = await db.users.findMany({
                where: {
                    id: {
                        in: otherParticipantIds
                    }
                },
                include: {
                    user_profiles: true
                }
            })

            return {
                id: room.id,
                name: room.name,
                type: room.type,
                lastMessage: room.chat_messages[0]?.content || null,
                lastMessageAt: room.chat_messages[0]?.created_at || room.created_at,
                users: otherParticipants.map(u => ({
                    id: u.id,
                    name: u.user_profiles ? `${u.user_profiles.first_name} ${u.user_profiles.last_name}` : u.email,
                    avatar: u.user_profiles?.avatar_url || null
                }))
            }
        }))

        return NextResponse.json({
            success: true,
            rooms: roomsWithParticipants
        })

    } catch (error) {
        console.error('Fetch chat rooms error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
