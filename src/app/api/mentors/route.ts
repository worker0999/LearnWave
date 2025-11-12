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
            user: {
              name: {
                contains: search,
                mode: 'insensitive'
              }
            }
          },
          {
            user: {
              email: {
                contains: search,
                mode: 'insensitive'
              }
            }
          },
          {
            bio: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            expertise: {
              contains: search,
              mode: 'insensitive'
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
            email: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      }
    })
    
    // Transform the data to match the frontend interface
    const transformedMentors = mentors.map(mentor => ({
      id: mentor.users.id,
      email: mentor.users.email,
      title: 'Professional Mentor',
      expertise: mentor.expertise_areas || [],
      experience: 0,
      rating: mentor.rating || 0,
      reviews: mentor.total_sessions,
      hourlyRate: mentor.hourly_rate || 0,
      availability: ['Monday', 'Wednesday', 'Friday'], // Mock data for now
      bio: 'Experienced mentor ready to help you achieve your goals.',
      education: mentor.resume_url || 'Education details not specified',
      location: 'Remote', // Mock data for now
      languages: ['English'],
      responseTime: '< 2 hours',
      completedSessions: mentor.total_sessions,
      isOnline: mentor.is_available, // Use availability status
      subjects: mentor.expertise_areas || []
    }))
    
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