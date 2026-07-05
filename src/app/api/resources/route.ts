import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const decoded = await verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const semester = searchParams.get('semester')
    const subject = searchParams.get('subject')
    const moduleNum = searchParams.get('module_number')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const isLibrary = searchParams.get('is_library') === 'true'

    const where: any = {
      is_approved: true,
      is_library: isLibrary
    }

    if (!isLibrary) {
      if (semester) where.semester = parseInt(semester)
      if (subject) where.subject = subject
      if (moduleNum) where.module_number = parseInt(moduleNum)
    } else {
      // For library books, allow optional subject/semester filters if supplied
      if (semester) where.semester = parseInt(semester)
      if (subject) where.subject = subject
    }
    
    if (type) where.type = type
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const resources = await db.resources.findMany({
      where,
      include: {
        users: {
          select: {
            user_profiles: {
              select: {
                first_name: true,
                last_name: true
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    const formatted = resources.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      fileUrl: r.fileUrl,
      fileSize: r.fileSize,
      type: r.type,
      uploadedBy: r.users?.user_profiles ? `${r.users.user_profiles.first_name} ${r.users.user_profiles.last_name}` : 'Unknown',
      createdAt: r.created_at,
      moduleNumber: r.module_number,
      isModelPaper: r.is_model_paper
    }))

    return NextResponse.json({ success: true, resources: formatted })
  } catch (error) {
    console.error('Fetch resources error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
