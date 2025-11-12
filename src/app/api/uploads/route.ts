import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromHeaders, verifyToken } from '@/lib/auth'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(request: NextRequest) {
  try {
    console.log('📁 File download request received')
    
    const token = getTokenFromHeaders(request.headers)
    
    if (!token) {
      console.log('❌ No token provided')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || (decoded.role !== 'STUDENT' && decoded.role !== 'ADMIN')) {
      console.log('❌ Invalid token or role')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get('id')
    const preview = searchParams.get('preview') === 'true'

    if (!resourceId) {
      console.log('❌ No resource ID provided')
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 })
    }

    console.log(`🔍 Looking for resource: ${resourceId}`)

    // Get resource from database
    const resource = await db.resources.findUnique({
      where: { id: resourceId },
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
      }
    })

    if (!resource) {
      console.log('❌ Resource not found')
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    if (!resource.fileUrl) {
      console.log('❌ No file URL for resource')
      return NextResponse.json({ error: 'File not available' }, { status: 404 })
    }

    console.log(`📂 File path: ${resource.fileUrl}`)
    console.log(`📄 File name: ${resource.fileName}`)

    // Increment download count (only for actual downloads, not previews)
    if (!preview) {
      await db.resources.update({
        where: { id: resourceId },
        data: {
          downloads: {
            increment: 1
          }
        }
      })
      console.log('📊 Download count incremented')
    }

    // Read file from disk
    const filePath = join(process.cwd(), resource.fileUrl)
    console.log(`🔍 Full file path: ${filePath}`)
    
    if (!existsSync(filePath)) {
      console.log('❌ File does not exist on disk')
      return NextResponse.json({ error: 'File not found on disk' }, { status: 404 })
    }
    
    try {
      const fileBuffer = await readFile(filePath)
      console.log(`✅ File read successfully, size: ${fileBuffer.length} bytes`)
      
      // Determine content type based on file extension
      const fileExtension = resource.fileName?.split('.').pop()?.toLowerCase()
      let contentType = 'application/octet-stream'
      
      switch (fileExtension) {
        case 'pdf':
          contentType = 'application/pdf'
          break
        case 'doc':
          contentType = 'application/msword'
          break
        case 'docx':
          contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          break
        case 'ppt':
          contentType = 'application/vnd.ms-powerpoint'
          break
        case 'pptx':
          contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          break
        case 'jpg':
        case 'jpeg':
          contentType = 'image/jpeg'
          break
        case 'png':
          contentType = 'image/png'
          break
        case 'mp4':
          contentType = 'video/mp4'
          break
        case 'zip':
          contentType = 'application/zip'
          break
      }

      console.log(`📋 Content-Type: ${contentType}`)

      const disposition = preview 
        ? `inline; filename="${resource.fileName || 'preview'}"`
        : `attachment; filename="${resource.fileName || 'download'}"`

      console.log(`📎 Content-Disposition: ${disposition}`)

      // Create response with proper headers
      const response = new NextResponse(new Uint8Array(fileBuffer), {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': disposition,
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': preview ? 'public, max-age=3600' : 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      })

      console.log('✅ File response created successfully')
      return response

    } catch (fileError) {
      console.error('❌ File read error:', fileError)
      return NextResponse.json({ error: 'File not found on disk' }, { status: 404 })
    }

  } catch (error) {
    console.error('❌ File serving error:', error)
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
  }
}