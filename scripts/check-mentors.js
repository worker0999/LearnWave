
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const mentorsCount = await prisma.mentors.count()
    const approvedMentorsCount = await prisma.mentors.count({ where: { approved: true } })
    console.log('Total mentors:', mentorsCount)
    console.log('Approved mentors:', approvedMentorsCount)

    const mentors = await prisma.mentors.findMany({
        include: {
            users: {
                include: {
                    user_profiles: true
                }
            }
        }
    })

    console.log('Mentors List:')
    mentors.forEach(m => {
        console.log(`- ${m.users.email} (Approved: ${m.approved})`)
        if (m.users.user_profiles) {
            console.log(`  Name: ${m.users.user_profiles.first_name} ${m.users.user_profiles.last_name}`)
        }
    })
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
