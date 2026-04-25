import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { searchDocumentChunks, buildContextFromChunks } from '@/lib/pdf-processor'
import { aiManager } from '@/lib/ai-config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * POST /api/ai/rag-chat
 * Chat with AI using RAG (Retrieval-Augmented Generation) from uploaded PDFs
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

        const { question, useInternalResources, resourceIds, subject, semester } = await request.json()

        if (!question) {
            return NextResponse.json({ error: 'Question is required' }, { status: 400 })
        }

        let relevantChunks: any[] = []
        let sources: any[] = []

        // If user wants to use internal resources, search the database
        if (useInternalResources) {
            // Get resource IDs to search
            let searchResourceIds = resourceIds

            // If no specific resources provided, search by subject/semester
            if (!searchResourceIds || searchResourceIds.length === 0) {
                const filters: any = { processed: true }

                if (subject) filters.subject = subject
                if (semester) filters.semester = semester

                const resources = await prisma.resources.findMany({
                    where: filters,
                    select: { id: true }
                })

                searchResourceIds = resources.map(r => r.id)
            }

            // Search for relevant chunks
            if (searchResourceIds && searchResourceIds.length > 0) {
                relevantChunks = await searchDocumentChunks(question, searchResourceIds, 5)

                // Build sources array with page numbers and previews
                sources = relevantChunks.map((chunk, index) => ({
                    id: chunk.id,
                    resourceId: chunk.resourceId,
                    resourceTitle: chunk.resourceTitle,
                    fileName: chunk.fileName,
                    fileUrl: chunk.fileUrl,
                    pageNumber: chunk.pageNumber,
                    preview: chunk.content.substring(0, 200) + '...',
                    fullContent: chunk.content,
                    relevanceScore: chunk.score
                }))
            }
        }

        // Build context from chunks
        const context = buildContextFromChunks(
            relevantChunks.map(chunk => ({
                content: chunk.content,
                pageNumber: chunk.pageNumber,
                resourceTitle: chunk.resourceTitle
            }))
        )

        // Create system prompt
        const systemPrompt = `You are an AI academic assistant for VTU students. You are helpful, knowledgeable, and provide accurate educational information.

${context ? `You have access to the following information from uploaded documents. Use this information to answer the question accurately and cite the sources with page numbers.

${context}

When answering:
1. Use the provided document information to answer the question
2. Cite sources by mentioning the document name and page number
3. If the documents don't contain enough information, say so clearly
4. Be precise and educational in your responses` : 'Answer the question based on your general knowledge. Be helpful and educational.'}`

        // Generate response using Gemini
        let response: string
        try {
            const result = await aiManager.generateWithFallback([
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: question
                }
            ], {
                temperature: 0.7,
                max_tokens: 1500
            })
            response = result.response
        } catch (aiError) {
            console.error('AI generation failed:', aiError)
            return NextResponse.json(
                { error: 'AI service temporarily unavailable. Please ensure GEMINI_API_KEY is set.' },
                { status: 503 }
            )
        }

        return NextResponse.json({
            response,
            sources,
            usedInternalResources: useInternalResources && sources.length > 0
        })

    } catch (error) {
        console.error('RAG Chat API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
