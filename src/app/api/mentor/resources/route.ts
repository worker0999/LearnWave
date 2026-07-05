import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

// ✅ GET /api/mentor/resources
// Fetch resources uploaded by the logged-in mentor
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

    const resources = await db.resources.findMany({
      where: {
        uploaded_by: decoded.userId
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json({ success: true, resources })
  } catch (error) {
    console.error('Error fetching mentor resources:', error)
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}

// ✅ POST /api/mentor/resources
// Upload a new resource/library item (defaults to pending admin approval)
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    console.log('MENTOR RESOURCES POST - token:', token ? token.substring(0, 15) + '...' : null, 'decoded:', decoded)
    if (!decoded || decoded.role !== 'MENTOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const subject = formData.get('subject') as string
    const semesterStr = formData.get('semester') as string
    const unit = formData.get('unit') as string
    const isLibraryStr = formData.get('is_library') as string
    const scheme = formData.get('scheme') as string
    const branch = formData.get('branch') as string
    const moduleNumStr = formData.get('module_number') as string
    const isModelPaperStr = formData.get('is_model_paper') as string
    const file = formData.get('file') as File

    if (!title || !file) {
      return NextResponse.json({ error: 'Title and file are required' }, { status: 400 })
    }

    const is_library = isLibraryStr === 'true'
    const semester = is_library ? 0 : (parseInt(semesterStr) || 1)
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

    // 🧩 Create resource in DB with is_approved: false
    const resource = await db.resources.create({
      data: {
        title,
        description: description || '',
        type: type || file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        subject: finalSubject,
        semester,
        unit: unit || '',
        fileName: file.name,
        fileUrl: `/api/uploads/resources/${fileName}`,
        fileSize: file.size,
        uploaded_by: decoded.userId,
        is_approved: false, // Mentor uploads always require approval
        is_library,
        scheme: is_library ? null : (scheme || '2025'),
        branch: is_library ? null : (branch || 'CSE'),
        module_number,
        is_model_paper
      }
    })

    // 🔔 Emit socket event for real-time notification to admin if global.io exists
    if (global.io) {
      global.io.to('admin-notifications').emit('mentor-resource-uploaded', {
        resourceId: resource.id,
        title: resource.title,
        uploadedBy: decoded.userId,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({ success: true, resource })
  } catch (error) {
    console.error('Error uploading mentor resource:', error)
    return NextResponse.json({ error: 'Failed to upload resource' }, { status: 500 })
  }
}

// ✅ DELETE /api/mentor/resources
// Delete resource uploaded by the current mentor
export async function DELETE(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || decoded.role !== 'MENTOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get('id')

    if (!resourceId) {
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 })
    }

    const existing = await db.resources.findUnique({ where: { id: resourceId } })
    if (!existing) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    // Security check: Only allow deleting own uploaded resource
    if (existing.uploaded_by !== decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await db.resources.delete({ where: { id: resourceId } })

    return NextResponse.json({ success: true, message: 'Resource deleted successfully' })
  } catch (error) {
    console.error('Error deleting mentor resource:', error)
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 })
  }
}
