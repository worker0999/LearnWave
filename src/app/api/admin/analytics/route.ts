import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromHeaders, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = getTokenFromHeaders(request.headers)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
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
      totalSessions,
      completedSessions,
      pendingSessions,
      confirmedSessions
    ] = await Promise.all([
      db.users.count(),
      db.users.count({ where: { role: 'STUDENT' } }),
      db.users.count({ where: { role: 'MENTOR' } }),
      db.users.count({ where: { role: 'ADMIN' } }),
      db.mentors.count({ where: { approved: false } }),
      db.mentors.count({ where: { approved: true } }),
      db.mentor_sessions.count(),
      db.mentor_sessions.count({ where: { status: 'COMPLETED' } }),
      db.mentor_sessions.count({ where: { status: 'PENDING' } }),
      db.mentor_sessions.count({ where: { status: 'CONFIRMED' } })
    ])

    // Get monthly user registration data (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyRegistrations = await db.users.groupBy({
      by: ['role'],
      where: {
        created_at: {
          gte: sixMonthsAgo
        }
      },
      _count: {
        id: true
      }
    })

    // Get mentor sessions statistics
    const sessionStats = await db.mentor_sessions.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    // Get top mentors by session count
    const topMentors = await db.users.findMany({
      where: {
        role: 'MENTOR',
        mentors: {
          approved: true
        }
      },
      include: {
        mentors: {
          select: {
            rating: true,
            hourly_rate: true,
            expertise_areas: true
          }
        }
      },
      orderBy: {
        email: 'asc'
      },
      take: 10
    })

    // Get recent activity
    const recentUsers = await db.users.findMany({
      take: 5,
      orderBy: {
        created_at: 'desc'
      },
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true
      }
    })

    const recentSessions = await db.mentor_sessions.findMany({
      take: 5,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        mentors: {
          include: {
            users: {
              select: {
                email: true
              }
            }
          }
        }
      }
    })

    // Calculate revenue from completed sessions
    const revenueData = await db.mentor_sessions.aggregate({
      where: {
        status: 'COMPLETED'
      },
      _sum: {
        price: true
      },
      _count: {
        id: true
      }
    })

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
        totalSessions,
        completedSessions,
        pendingSessions,
        confirmedSessions,
        totalRevenue: revenueData._sum.amount || 0,
        completedSessionsCount: revenueData._count.id || 0
      },
      monthlyRegistrations,
      sessionStats,
      topMentors: topMentors.map(mentor => ({
        id: mentor.id,
        email: mentor.email,
        rating: mentor.mentors?.rating || 0,
        hourlyRate: mentor.mentors?.hourly_rate || 0,
        expertise: mentor.mentors?.expertise_areas || []
      })),
      recentActivity: {
        recentUsers,
        recentSessions
      }
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