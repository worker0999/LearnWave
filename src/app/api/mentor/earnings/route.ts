import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'MENTOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = decoded.userId as string

    // 1. Get the mentor record
    const mentor = await db.mentors.findFirst({
      where: { user_id: userId }
    })

    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
    }

    // 2. Fetch all bookings for this mentor
    const bookings = await db.bookings.findMany({
      where: {
        mentor_id: mentor.id
      },
      include: {
        users: { // student users
          select: {
            id: true,
            email: true,
            user_profiles: {
              select: {
                first_name: true,
                last_name: true
              }
            }
          }
        },
        mentor_sessions: true
      },
      orderBy: {
        scheduled_at: 'desc'
      }
    })

    // 3. Compute telemetry metrics
    const confirmedOrCompleted = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    const totalEarnings = confirmedOrCompleted.reduce((sum, b) => sum + Number(b.price), 0)
    const pendingPayments = bookings.filter(b => b.status === 'PENDING').reduce((sum, b) => sum + Number(b.price), 0)
    const completedSessions = bookings.filter(b => b.status === 'COMPLETED').length
    const averageRating = Number(mentor.rating) || 4.5

    // 4. Map transactions
    const transactions = bookings.map(b => {
      const profile = b.users.user_profiles
      const studentName = profile ? `${profile.first_name} ${profile.last_name}` : b.users.email
      const sessionType = b.mentor_sessions?.title || '1-on-1 Session'

      return {
        id: b.id,
        date: b.scheduled_at.toISOString().split('T')[0],
        student: studentName,
        sessionType,
        amount: Number(b.price),
        status: b.status.toLowerCase()
      }
    })

    // 5. Generate daily chart data for last 30 days
    const chartMap = new Map<string, number>()
    
    // Pre-populate last 7 days with 0 earnings so the chart looks nice if empty
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateString = d.toISOString().split('T')[0]
      chartMap.set(dateString, 0)
    }

    // Fill in actual earnings
    confirmedOrCompleted.forEach(b => {
      const dateString = b.scheduled_at.toISOString().split('T')[0]
      const current = chartMap.get(dateString) || 0
      chartMap.set(dateString, current + Number(b.price))
    })

    const chartData = Array.from(chartMap.entries()).map(([date, amount]) => ({
      date,
      amount
    })).sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({
      success: true,
      stats: {
        totalEarnings,
        pendingPayments,
        completedSessions,
        averageRating
      },
      transactions,
      earningsData: chartData
    })

  } catch (error) {
    console.error('Error fetching mentor earnings telemetry:', error)
    return NextResponse.json({ error: 'Failed to fetch earnings statistics' }, { status: 500 })
  }
}
