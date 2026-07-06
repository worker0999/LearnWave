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
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Query all student user profiles along with their user progress (XP)
    const profiles = await db.user_profiles.findMany({
      where: {
        users: {
          role: 'STUDENT'
        }
      },
      select: {
        college: true,
        users: {
          select: {
            user_progress: {
              select: {
                xp: true
              }
            }
          }
        }
      }
    })

    // Group progress by college
    const collegeMap: Record<string, { totalXP: number; studentCount: number; averageXP: number }> = {}

    profiles.forEach((profile) => {
      const collegeName = profile.college || 'Visvesvaraya Technological University'
      const studentXp = profile.users?.user_progress?.xp || 0

      if (!collegeMap[collegeName]) {
        collegeMap[collegeName] = { totalXP: 0, studentCount: 0, averageXP: 0 }
      }

      collegeMap[collegeName].totalXP += studentXp
      collegeMap[collegeName].studentCount += 1
    })

    // Calculate averages and transform to ranked array
    const rankings = Object.keys(collegeMap).map((collegeName) => {
      const data = collegeMap[collegeName]
      return {
        college: collegeName,
        totalXP: data.totalXP,
        studentCount: data.studentCount,
        averageXP: Math.round(data.totalXP / data.studentCount)
      }
    })

    // Sort by average XP (or total XP if preferred)
    rankings.sort((a, b) => b.averageXP - a.averageXP)

    // Add rank numbers
    const rankedColleges = rankings.map((item, index) => ({
      rank: index + 1,
      ...item
    }))

    return NextResponse.json({ success: true, rankings: rankedColleges })
  } catch (error) {
    console.error('College rankings fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
