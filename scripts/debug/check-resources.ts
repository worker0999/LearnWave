import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkResources() {
    try {
        console.log('Checking resources in database...\n')

        const totalResources = await prisma.resources.count()
        console.log(`Total resources: ${totalResources}`)

        const processedResources = await prisma.resources.count({
            where: { processed: true }
        })
        console.log(`Processed resources: ${processedResources}`)

        const unprocessedResources = await prisma.resources.count({
            where: { processed: false }
        })
        console.log(`Unprocessed resources: ${unprocessedResources}`)

        const totalChunks = await prisma.document_chunks.count()
        console.log(`\nTotal document chunks: ${totalChunks}`)

        // Show some sample resources
        const sampleResources = await prisma.resources.findMany({
            take: 5,
            select: {
                id: true,
                title: true,
                fileName: true,
                fileUrl: true,
                type: true,
                processed: true,
                created_at: true
            },
            orderBy: {
                created_at: 'desc'
            }
        })

        console.log('\nSample resources:')
        sampleResources.forEach((resource, index) => {
            console.log(`${index + 1}. ${resource.title}`)
            console.log(`   File: ${resource.fileName}`)
            console.log(`   URL: ${resource.fileUrl}`)
            console.log(`   Type: ${resource.type}`)
            console.log(`   Processed: ${resource.processed ? '✓' : '✗'}`)
            console.log(`   Created: ${resource.created_at.toLocaleDateString()}`)
            console.log('')
        })

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkResources()
