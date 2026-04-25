const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const mentorUsers = await prisma.users.findMany({
        where: { role: 'MENTOR' },
        include: { mentors: true }
    })

    console.log(`Found ${mentorUsers.length} users with role MENTOR:`)
    mentorUsers.forEach(u => {
        console.log(`- Email: ${u.email}, Has Mentor Record: ${!!u.mentors}, Approved: ${u.mentors?.approved}`)
    })
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
