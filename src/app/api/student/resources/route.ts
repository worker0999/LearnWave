import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromHeaders, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeaders(request.headers)
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const subject = searchParams.get('subject')
    const type = searchParams.get('type')
    const semester = searchParams.get('semester')

    let whereClause: any = {}
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (subject && subject !== 'all') {
      whereClause.subject = subject
    }
    
    if (type && type !== 'all') {
      whereClause.type = type.toUpperCase()
    }
    
    if (semester && semester !== 'all') {
      whereClause.semester = parseInt(semester)
    }

    const resources = await db.resources.findMany({
      where: whereClause,
      include: {
        users: {
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
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      resources: resources.map(resource => {
        const profile = resource.users?.user_profiles
        const uploaderName = profile
          ? `${profile.first_name} ${profile.last_name}`
          : resource.users?.email || 'Unknown'

        return {
          id: resource.id,
          title: resource.title,
          description: resource.description,
          type: resource.type.toLowerCase(),
          subject: resource.subject,
          semester: resource.semester,
          unit: resource.unit,
          author: uploaderName,
          uploadDate: new Date(resource.created_at).toISOString().split('T')[0],
          downloads: 0,
          rating: 4.5,
          size: resource.fileSize ? `${(resource.fileSize / (1024 * 1024)).toFixed(1)} MB` : undefined,
          fileUrl: resource.fileUrl,
          fileName: resource.fileName,
          tags: [],
          uploadedBy: uploaderName
        }
      })
    })

  } catch (error) {
    console.error('Error fetching student resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}