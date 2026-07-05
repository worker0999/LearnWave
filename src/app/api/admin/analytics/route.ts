import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get overall statistics
    const [
      totalUsers,
      totalStudents,
      totalMentors,
      totalAdmins,
      pendingMentors,
      approvedMentors,
      totalBookings,
      completedBookings,
      pendingBookings,
      confirmedBookings
    ] = await Promise.all([
      db.users.count(),
      db.users.count({ where: { role: 'STUDENT' } }),
      db.users.count({ where: { role: 'MENTOR' } }),
      db.users.count({ where: { role: 'ADMIN' } }),
      db.mentors.count({ where: { approved: false } }),
      db.mentors.count({ where: { approved: true } }),
      db.bookings.count(),
      db.bookings.count({ where: { status: 'COMPLETED' } }),
      db.bookings.count({ where: { status: 'PENDING' } }),
      db.bookings.count({ where: { status: 'CONFIRMED' } })
    ])

    // Get monthly user registration data (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const registrationData = await db.users.findMany({
      where: {
        created_at: {
          gte: sixMonthsAgo
        }
      },
      select: {
        created_at: true,
        role: true
      }
    })

    // Process monthly growth
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyGrowth = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const monthLabel = months[d.getMonth()]
      const count = registrationData.filter(u =>
        new Date(u.created_at).getMonth() === d.getMonth() &&
        new Date(u.created_at).getFullYear() === d.getFullYear()
      ).length
      return { month: monthLabel, count }
    }).reverse()

    // Calculate revenue from completed bookings
    const revenueData = await db.bookings.aggregate({
      where: {
        status: 'COMPLETED'
      },
      _sum: {
        price: true
      }
    })

    // Get top mentors by rating
    const topMentors = await db.mentors.findMany({
      where: {
        approved: true
      },
      include: {
        users: {
          select: {
            email: true,
            user_profiles: {
              select: {
                first_name: true,
                last_name: true,
                avatar_url: true
              }
            }
          }
        }
      },
      orderBy: {
        rating: 'desc'
      },
      take: 5
    })

    // Get popular topics (from session tags)
    const sessionsWithTags = await db.mentor_sessions.findMany({
      select: {
        tags: true
      }
    })

    const tagCounts: Record<string, number> = {}
    sessionsWithTags.forEach(s => {
      s.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })

    const popularTopics = Object.entries(tagCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const analytics = {
      overview: {
        totalUsers,
        totalStudents,
        totalMentors,
        totalAdmins,
        pendingMentors,
        approvedMentors
      },
      sessions: {
        totalSessions: totalBookings,
        completedSessions: completedBookings,
        pendingSessions: pendingBookings,
        confirmedSessions: confirmedBookings,
        totalRevenue: Number(revenueData._sum.price || 0)
      },
      growth: monthlyGrowth,
      popularTopics,
      topMentors: topMentors.map(m => ({
        id: m.id,
        name: m.users.user_profiles ? `${m.users.user_profiles.first_name} ${m.users.user_profiles.last_name}` : m.users.email,
        rating: Number(m.rating),
        sessions: m.total_sessions,
        avatar: m.users.user_profiles?.avatar_url
      }))
    }

    return NextResponse.json({
      success: true,
      analytics
    })

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
