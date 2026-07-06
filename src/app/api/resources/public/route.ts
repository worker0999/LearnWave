import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isRateLimited } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
    
    // Apply request rate-limit to avoid scraping the public API (60 reqs/min)
    if (isRateLimited(`rate-limit:public-list:${ip}`, 60, 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { searchParams } = new URL(request.url)
    const semester = searchParams.get('semester')
    const subject = searchParams.get('subject')
    const branch = searchParams.get('branch')
    const moduleNum = searchParams.get('module_number')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const scheme = searchParams.get('scheme')

    const where: any = {
      is_approved: true,
      is_public: true,
      is_library: false // Only VTU syllabus resources are public
    }

    if (semester) where.semester = parseInt(semester)
    if (subject) where.subject = subject
    if (branch) where.branch = branch
    if (scheme) where.scheme = scheme
    if (moduleNum) where.module_number = parseInt(moduleNum)
    if (type) where.type = type
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } }
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
      isModelPaper: r.is_model_paper,
      semester: r.semester,
      subject: r.subject,
      branch: r.branch,
      unit: r.unit,
      scheme: r.scheme
    }))

    return NextResponse.json({ success: true, resources: formatted })
  } catch (error) {
    console.error('Fetch public resources error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
