import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

// ✅ GET /api/admin/resources
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const subject = searchParams.get('subject')
    const type = searchParams.get('type')
    const semester = searchParams.get('semester')

    const whereClause: any = {}

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (subject && subject !== 'ALL') whereClause.subject = subject
    if (type && type !== 'ALL') whereClause.type = type
    if (semester && semester !== 'ALL') whereClause.semester = parseInt(semester)

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
      orderBy: { created_at: 'desc' }
    })

    const formatted = resources.map(resource => {
      const profile = resource.users?.user_profiles
      const uploaderName = profile
        ? `${profile.first_name} ${profile.last_name}`
        : resource.users?.email || 'Unknown'

      return { ...resource, uploadedBy: uploaderName }
    })

    return NextResponse.json({ success: true, resources: formatted })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}

// ✅ POST /api/admin/resources
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const subject = formData.get('subject') as string
    const semester = formData.get('semester') as string
    const unit = formData.get('unit') as string
    const scheme = formData.get('scheme') as string
    const branch = formData.get('branch') as string
    const moduleNumStr = formData.get('module_number') as string
    const isModelPaperStr = formData.get('is_model_paper') as string
    const isLibraryStr = formData.get('is_library') as string
    const file = formData.get('file') as File

    if (!title || !file)
      return NextResponse.json({ error: 'Title and file are required' }, { status: 400 })

    const is_library = isLibraryStr === 'true'
    const finalSemester = is_library ? 0 : (parseInt(semester) || 1)
    const finalSubject = is_library ? 'Library Book' : (subject || 'General')
    
    const module_number = moduleNumStr ? parseInt(moduleNumStr) : null
    const is_model_paper = isModelPaperStr === 'true'

    // 📁 Ensure upload folder exists
    const uploadsDir = join(process.cwd(), 'uploads', 'resources')
    await mkdir(uploadsDir, { recursive: true })

    // 📄 Save file locally
    const timestamp = Date.now()
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}_${safeFileName}`
    const filePath = join(uploadsDir, fileName)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    // 🧩 Create resource in DB
    const resource = await db.resources.create({
      data: {
        title,
        description: description || '',
        type: type || file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        subject: finalSubject,
        semester: finalSemester,
        unit: unit || '',
        fileName: file.name,
        fileUrl: `/api/uploads/resources/${fileName}`,
        fileSize: file.size,
        uploaded_by: decoded.userId,
        is_approved: true, // Admin uploads are auto-approved (verified batch)
        is_library,
        scheme: is_library ? null : (scheme || '2025'),
        branch: is_library ? null : (branch || 'CSE'),
        module_number,
        is_model_paper
      },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            user_profiles: {
              select: { first_name: true, last_name: true }
            }
          }
        }
      }
    })

    const profile = resource.users?.user_profiles
    const uploaderName = profile
      ? `${profile.first_name} ${profile.last_name}`
      : resource.users?.email || 'Unknown'

    const resourceWithUploader = { ...resource, uploadedBy: uploaderName }

    // 🔔 Emit socket event for real-time update
    if (global.io) {
      global.io.to('resources').emit('resource-uploaded', {
        type: 'upload',
        resource: resourceWithUploader,
        timestamp: new Date().toISOString()
      })
      console.log(`📡 Resource upload event emitted for: ${title}`)
    }

    return NextResponse.json({
      success: true,
      resource: resourceWithUploader
    })
  } catch (error) {
    console.error('Error uploading resource:', error)
    return NextResponse.json({ error: 'Failed to upload resource' }, { status: 500 })
  }
}

// ✅ DELETE /api/admin/resources
export async function DELETE(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get('id')

    if (!resourceId)
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 })

    const existing = await db.resources.findUnique({ where: { id: resourceId } })
    if (!existing)
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })

    await db.resources.delete({ where: { id: resourceId } })

    // 🔔 Emit socket event for real-time deletion
    if (global.io) {
      global.io.to('resources').emit('resource-deleted', {
        type: 'delete',
        resourceId,
        timestamp: new Date().toISOString()
      })
      console.log(`📡 Resource deletion event emitted for ID: ${resourceId}`)
    }

    return NextResponse.json({ success: true, message: 'Resource deleted successfully' })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 })
  }
}

// ✅ PATCH /api/admin/resources
// Approve or reject resources
export async function PATCH(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { resourceId, approved } = body

    if (!resourceId)
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 })

    const updated = await db.resources.update({
      where: { id: resourceId },
      data: {
        is_approved: approved !== undefined ? approved : true
      }
    })

    return NextResponse.json({ success: true, resource: updated })
  } catch (error) {
    console.error('Error updating resource approval status:', error)
    return NextResponse.json({ error: 'Failed to update resource status' }, { status: 500 })
  }
}
