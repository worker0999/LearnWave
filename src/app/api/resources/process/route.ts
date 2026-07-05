import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { processPDFForRAG } from '@/lib/pdf-processor'
import { db as prisma } from '@/lib/db'
import path from 'path'

/**
 * POST /api/resources/process
 * Process a PDF resource for RAG functionality
 */
export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const authHeader = request.headers.get('authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.substring(7)
        const payload = await verifyToken(token)
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const { resourceId } = await request.json()

        if (!resourceId) {
            return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 })
        }

        // Get resource from database
        const resource = await prisma.resources.findUnique({
            where: { id: resourceId }
        })

        if (!resource) {
            return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
        }

        // Check if already processed
        if (resource.processed) {
            return NextResponse.json({
                message: 'Resource already processed',
                resourceId: resource.id
            })
        }

        // Get file path
        const fileName = path.basename(resource.fileUrl)
        const filePath = path.join(process.cwd(), 'uploads', 'resources', fileName)

        // Process PDF
        await processPDFForRAG(resourceId, filePath)

        return NextResponse.json({
            message: 'Resource processed successfully',
            resourceId: resource.id
        })

    } catch (error) {
        console.error('Process resource error:', error)
        return NextResponse.json(
            { error: 'Failed to process resource' },
            { status: 500 }
        )
    }
}
