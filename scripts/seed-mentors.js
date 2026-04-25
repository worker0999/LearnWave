
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const prisma = new PrismaClient()

async function main() {
    const passwordHash = await bcrypt.hash('password123', 10)

    const mentorData = [
        {
            email: 'jane.doe@example.com',
            firstName: 'Jane',
            lastName: 'Doe',
            expertise: ['Machine Learning', 'AI', 'Python'],
            bio: 'PhD in AI with 10 years of industry experience.',
            hourlyRate: 50
        },
        {
            email: 'robert.smith@example.com',
            firstName: 'Robert',
            lastName: 'Smith',
            expertise: ['Data Structures', 'Algorithms', 'C++'],
            bio: 'Competitive programmer and software architect.',
            hourlyRate: 45
        },
        {
            email: 'emily.chen@example.com',
            firstName: 'Emily',
            lastName: 'Chen',
            expertise: ['Web Development', 'React', 'Node.js'],
            bio: 'Fullstack developer passionate about building scalable apps.',
            hourlyRate: 40
        }
    ]

    for (const data of mentorData) {
        const userId = uuidv4()
        const mentorId = uuidv4()
        const profileId = uuidv4()

        // Since upsert with nested create is tricky if we don't know if parent exists
        // we just check if user exists
        let user = await prisma.users.findUnique({ where: { email: data.email } })

        if (!user) {
            user = await prisma.users.create({
                data: {
                    id: userId,
                    email: data.email,
                    password_hash: passwordHash,
                    role: 'MENTOR',
                    is_active: true,
                    updated_at: new Date(),
                    user_profiles: {
                        create: {
                            id: profileId,
                            first_name: data.firstName,
                            last_name: data.lastName,
                            bio: data.bio,
                            updated_at: new Date()
                        }
                    },
                    mentors: {
                        create: {
                            id: mentorId,
                            approved: true,
                            expertise_areas: data.expertise,
                            hourly_rate: data.hourlyRate,
                            rating: 4.8,
                            total_sessions: Math.floor(Math.random() * 100),
                            is_available: true,
                            updated_at: new Date()
                        }
                    }
                }
            })
            console.log(`Created mentor: ${data.email}`)
        } else {
            console.log(`Mentor already exists: ${data.email}`)
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
