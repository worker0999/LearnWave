const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const mentors = await prisma.users.findMany({
        where: { role: 'MENTOR' },
        include: { mentors: true, user_profiles: true }
    })

    console.log(`Mentor Sync Status:`)
    mentors.forEach(m => {
        console.log(`- ${m.email}: Profile: ${!!m.user_profiles}, Record: ${!!m.mentors}`)
    })
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
