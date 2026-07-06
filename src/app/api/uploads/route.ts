import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { logger } from '@/lib/logger'
import { isRateLimited } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  try {
    logger.debug('📁 File download request received')

    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get('id')
    const preview = searchParams.get('preview') === 'true'

    if (!resourceId) {
      logger.debug('❌ No resource ID provided')
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 })
    }

    logger.debug(`🔍 Looking for resource: ${resourceId}`)

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
      logger.debug('❌ Resource not found')
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    const token = getTokenFromRequest(request)

    if (!token) {
      if (resource.is_public && resource.is_approved) {
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
        if (isRateLimited(`rate-limit:public-download:${ip}`, 20, 60 * 60 * 1000)) {
          logger.debug(`❌ Rate limit hit for public download: ${ip}`)
          return NextResponse.json({ error: 'Download limit reached — sign up for unlimited access.' }, { status: 429 })
        }
        logger.debug(`🔓 Public resource download allowed: ${resourceId}`)
      } else {
        logger.debug('❌ No token provided')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    } else {
      const decoded = await verifyToken(token)
      if (!decoded || (decoded.role !== 'STUDENT' && decoded.role !== 'ADMIN' && decoded.role !== 'MENTOR')) {
        logger.debug('❌ Invalid token or role')
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    if (!resource.fileUrl) {
      logger.debug('❌ No file URL for resource')
      return NextResponse.json({ error: 'File not available' }, { status: 404 })
    }

    logger.debug(`📂 File path: ${resource.fileUrl}`)
    logger.debug(`📄 File name: ${resource.fileName}`)

    // Increment download count (only for actual downloads, not previews)
    if (!preview) {
      await db.resources.update({
        where: { id: resourceId },
        data: {
          downloadCount: {
            increment: 1
          }
        }
      })
      logger.debug('📊 Download count incremented')
    }

    // Read file from disk
    const filePath = join(process.cwd(), resource.fileUrl)
    logger.debug(`🔍 Full file path: ${filePath}`)

    if (!existsSync(filePath)) {
      logger.debug('❌ File does not exist on disk')
      return NextResponse.json({ error: 'File not found on disk' }, { status: 404 })
    }

    try {
      const fileBuffer = await readFile(filePath)
      logger.debug(`✅ File read successfully, size: ${fileBuffer.length} bytes`)

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

      logger.debug(`📋 Content-Type: ${contentType}`)

      const disposition = preview
        ? `inline; filename="${resource.fileName || 'preview'}"`
        : `attachment; filename="${resource.fileName || 'download'}"`

      logger.debug(`📎 Content-Disposition: ${disposition}`)

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

      logger.debug('✅ File response created successfully')
      return response

    } catch (fileError) {
      logger.error('❌ File read error:', fileError)
      return NextResponse.json({ error: 'File not found on disk' }, { status: 404 })
    }

  } catch (error) {
    logger.error('❌ File serving error:', error)
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 })
  }
}
