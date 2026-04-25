import { PrismaClient } from '@prisma/client'
import { processPDFForRAG } from '../src/lib/pdf-processor'
import path from 'path'

const prisma = new PrismaClient()

async function processAllPDFs() {
    try {
        console.log('Starting to process all PDF resources...')

        // Get all unprocessed PDF resources
        const resources = await prisma.resources.findMany({
            where: {
                processed: false,
                OR: [
                    { type: 'pdf' },
                    { type: 'PDF' },
                    { type: 'application/pdf' }
                ]
            }
        })

        console.log(`Found ${resources.length} unprocessed PDF resources`)

        for (const resource of resources) {
            try {
                console.log(`\nProcessing: ${resource.title} (${resource.fileName})`)

                const fileName = path.basename(resource.fileUrl)
                const filePath = path.join(process.cwd(), 'uploads', 'resources', fileName)

                await processPDFForRAG(resource.id, filePath)

                console.log(`✓ Successfully processed: ${resource.title}`)
            } catch (error) {
                console.error(`✗ Failed to process ${resource.title}:`, error)
            }
        }

        console.log('\n=== Processing Complete ===')
        console.log(`Total resources processed: ${resources.length}`)

    } catch (error) {
        console.error('Error in batch processing:', error)
    } finally {
        await prisma.$disconnect()
    }
}

// Run the script
processAllPDFs()
