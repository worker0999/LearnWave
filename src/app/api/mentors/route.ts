import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    const expertise = searchParams.get('expertise')
    const search = searchParams.get('search')

    // Build where clause for approved mentors only
    const where: any = {
      approved: true
    }

    if (subject || expertise || search) {
      where.OR = []

      if (subject) {
        where.OR.push({
          expertise: {
            contains: subject,
            mode: 'insensitive'
          }
        })
      }

      if (expertise) {
        where.OR.push({
          expertise: {
            contains: expertise,
            mode: 'insensitive'
          }
        })
      }

      if (search) {
        where.OR.push(
          {
            users: {
              email: {
                contains: search,
                mode: 'insensitive'
              }
            }
          },
          {
            users: {
              user_profiles: {
                OR: [
                  { first_name: { contains: search, mode: 'insensitive' } },
                  { last_name: { contains: search, mode: 'insensitive' } }
                ]
              }
            }
          },
          {
            expertise_areas: {
              hasSome: [search] // This might not work perfectly for partial matches but let's see
            }
          }
        )
      }
    }

    const mentors = await db.mentors.findMany({
      where,
      include: {
        users: {
          select: {
            id: true,
            email: true,
            user_profiles: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      }
    })

    // Transform the data to match the frontend interface
    const transformedMentors = mentors.map(mentor => {
      const profile = mentor.users.user_profiles;
      const name = profile ? `${profile.first_name} ${profile.last_name}` : mentor.users.email;

      return {
        id: mentor.users.id,
        mentorId: mentor.id,
        name: name,
        email: mentor.users.email,
        avatar: profile?.avatar_url,
        title: 'Professional Mentor',
        expertise: mentor.expertise_areas || [],
        experience: 0,
        rating: Number(mentor.rating) || 0,
        reviews: mentor.total_sessions,
        hourlyRate: Number(mentor.hourly_rate) || 0,
        availability: mentor.is_available ? 'Available Today' : 'Not Available',
        bio: profile?.bio || 'Experienced mentor ready to help you achieve your goals.',
        education: mentor.resume_url || 'Education details not specified',
        location: profile?.branch || 'Remote',
        languages: ['English'],
        responseTime: '< 2 hours',
        completedSessions: mentor.total_sessions,
        isOnline: mentor.is_available,
        subjects: mentor.expertise_areas || []
      }
    })

    return NextResponse.json({
      success: true,
      mentors: transformedMentors
    })

  } catch (error) {
    console.error('Fetch mentors error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mentors' },
      { status: 500 }
    )
  }
}
