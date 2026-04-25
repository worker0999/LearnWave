import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

// pdf-parse is a CommonJS module, so we need to use require
// const pdf = require('pdf-parse') // Moved to inside functions to avoid build issues

const prisma = new PrismaClient()

interface PDFChunk {
    pageNumber: number
    chunkIndex: number
    content: string
    tokenCount: number
}

/**
 * Extract text from PDF file page by page
 */
export async function extractPDFText(filePath: string): Promise<{ text: string; pageTexts: string[] }> {
    const pdf = require('pdf-parse')
    const dataBuffer = fs.readFileSync(filePath)

    const data = await pdf(dataBuffer, {
        // Extract page by page
        pagerender: async (pageData: any) => {
            const textContent = await pageData.getTextContent()
            const strings = textContent.items.map((item: any) => item.str)
            return strings.join(' ')
        }
    })

    return {
        text: data.text,
        pageTexts: data.text.split('\n\n') // Simple page splitting
    }
}

/**
 * Extract text with proper page tracking
 */
export async function extractPDFWithPages(filePath: string): Promise<Map<number, string>> {
    const pdf = require('pdf-parse')
    const dataBuffer = fs.readFileSync(filePath)
    const pageMap = new Map<number, string>()

    const data = await pdf(dataBuffer)

    // Parse the text to identify page breaks
    // This is a simplified version - in production you'd want more sophisticated parsing
    const fullText = data.text
    const pages = fullText.split('\f') // Form feed character often indicates page breaks

    pages.forEach((pageText, index) => {
        if (pageText.trim()) {
            pageMap.set(index + 1, pageText.trim())
        }
    })

    // If no form feeds found, split by estimated page size
    if (pageMap.size === 0) {
        const estimatedCharsPerPage = 2000
        let currentPage = 1
        let currentPos = 0

        while (currentPos < fullText.length) {
            const chunk = fullText.substring(currentPos, currentPos + estimatedCharsPerPage)
            pageMap.set(currentPage, chunk)
            currentPos += estimatedCharsPerPage
            currentPage++
        }
    }

    return pageMap
}

/**
 * Chunk text into smaller pieces for better retrieval
 */
export function chunkText(text: string, maxTokens: number = 500): string[] {
    const chunks: string[] = []
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

    let currentChunk = ''
    let currentTokens = 0

    for (const sentence of sentences) {
        const sentenceTokens = estimateTokens(sentence)

        if (currentTokens + sentenceTokens > maxTokens && currentChunk) {
            chunks.push(currentChunk.trim())
            currentChunk = sentence
            currentTokens = sentenceTokens
        } else {
            currentChunk += ' ' + sentence
            currentTokens += sentenceTokens
        }
    }

    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim())
    }

    return chunks
}

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 */
export function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4)
}

/**
 * Process a PDF file and store chunks in database
 */
export async function processPDFForRAG(resourceId: string, filePath: string): Promise<void> {
    try {
        console.log(`Processing PDF for resource ${resourceId}...`)

        // Extract text with page tracking
        const pageMap = await extractPDFWithPages(filePath)

        // Process each page
        const chunks: PDFChunk[] = []

        for (const [pageNumber, pageText] of pageMap.entries()) {
            // Chunk the page text
            const pageChunks = chunkText(pageText, 500)

            pageChunks.forEach((chunkContent, chunkIndex) => {
                chunks.push({
                    pageNumber,
                    chunkIndex,
                    content: chunkContent,
                    tokenCount: estimateTokens(chunkContent)
                })
            })
        }

        console.log(`Created ${chunks.length} chunks from ${pageMap.size} pages`)

        // Store chunks in database
        await prisma.document_chunks.createMany({
            data: chunks.map(chunk => ({
                resource_id: resourceId,
                page_number: chunk.pageNumber,
                chunk_index: chunk.chunkIndex,
                content: chunk.content,
                token_count: chunk.tokenCount
            }))
        })

        // Mark resource as processed
        await prisma.resources.update({
            where: { id: resourceId },
            data: { processed: true }
        })

        console.log(`Successfully processed PDF for resource ${resourceId}`)
    } catch (error) {
        console.error(`Error processing PDF for resource ${resourceId}:`, error)
        throw error
    }
}

/**
 * Search for relevant chunks based on query
 * This is a simple keyword-based search. For production, consider using embeddings.
 */
export async function searchDocumentChunks(
    query: string,
    resourceIds?: string[],
    limit: number = 5
): Promise<Array<{
    id: string
    content: string
    pageNumber: number
    resourceId: string
    resourceTitle: string
    fileName: string
    fileUrl: string
    score: number
}>> {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2)

    // Get all chunks (optionally filtered by resource IDs)
    const chunks = await prisma.document_chunks.findMany({
        where: resourceIds && resourceIds.length > 0 ? {
            resource_id: { in: resourceIds }
        } : undefined,
        include: {
            resources: {
                select: {
                    id: true,
                    title: true,
                    fileName: true,
                    fileUrl: true
                }
            }
        }
    })

    // Score chunks based on keyword matching
    const scoredChunks = chunks.map(chunk => {
        const contentLower = chunk.content.toLowerCase()
        let score = 0

        // Count keyword occurrences
        queryTerms.forEach(term => {
            const regex = new RegExp(term, 'gi')
            const matches = contentLower.match(regex)
            if (matches) {
                score += matches.length
            }
        })

        // Boost score for chunks with multiple query terms
        const uniqueTermsFound = queryTerms.filter(term =>
            contentLower.includes(term)
        ).length
        score *= (uniqueTermsFound / queryTerms.length)

        return {
            id: chunk.id,
            content: chunk.content,
            pageNumber: chunk.page_number,
            resourceId: chunk.resources.id,
            resourceTitle: chunk.resources.title,
            fileName: chunk.resources.fileName,
            fileUrl: chunk.resources.fileUrl,
            score
        }
    })

    // Sort by score and return top results
    return scoredChunks
        .filter(chunk => chunk.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
}

/**
 * Get context from chunks for RAG
 */
export function buildContextFromChunks(
    chunks: Array<{ content: string; pageNumber: number; resourceTitle: string }>
): string {
    if (chunks.length === 0) {
        return ''
    }

    let context = 'Based on the following information from uploaded documents:\n\n'

    chunks.forEach((chunk, index) => {
        context += `[Source ${index + 1}: ${chunk.resourceTitle}, Page ${chunk.pageNumber}]\n`
        context += `${chunk.content}\n\n`
    })

    return context
}
