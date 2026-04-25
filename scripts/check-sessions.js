const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const sessions = await prisma.mentor_sessions.findMany()
    console.log('Mentor Sessions:', sessions)
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
