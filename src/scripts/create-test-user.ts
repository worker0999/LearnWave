import { db } from '../lib/db'
import { hashPassword } from '../lib/auth'

async function createTestUser() {
  try {
    // Create a test student
    const studentPassword = await hashPassword('student123')
    const student = await db.users.upsert({
      where: { email: 'student@learnwave.com' },
      update: {},
      create: {
        email: 'student@learnwave.com',
        password_hash: studentPassword,
        role: 'STUDENT',
        usn: '1CS21CS001'
      }
    })

    console.log('✅ Test student created:', student.email)

    // Create student profile
    await db.user_profiles.upsert({
      where: { user_id: student.id },
      update: {},
      create: {
        user_id: student.id,
        first_name: 'Test',
        last_name: 'Student',
        branch: 'Computer Science',
        year: 3,
        semester: 5
      }
    })

    // Create a test admin
    const adminPassword = await hashPassword('admin123')
    const admin = await db.users.upsert({
      where: { email: 'admin@learnwave.com' },
      update: {},
      create: {
        email: 'admin@learnwave.com',
        password_hash: adminPassword,
        role: 'ADMIN'
      }
    })

    console.log('✅ Test admin created:', admin.email)

    // Create admin profile
    await db.user_profiles.upsert({
      where: { user_id: admin.id },
      update: {},
      create: {
        user_id: admin.id,
        first_name: 'Test',
        last_name: 'Admin'
      }
    })

    // Create a test mentor
    const mentorPassword = await hashPassword('mentor123')
    const mentor = await db.users.upsert({
      where: { email: 'mentor@learnwave.com' },
      update: {},
      create: {
        email: 'mentor@learnwave.com',
        password_hash: mentorPassword,
        role: 'MENTOR'
      }
    })

    console.log('✅ Test mentor created:', mentor.email)

    // Create mentor profile
    await db.user_profiles.upsert({
      where: { user_id: mentor.id },
      update: {},
      create: {
        user_id: mentor.id,
        first_name: 'Test',
        last_name: 'Mentor',
        bio: 'Experienced software engineer with 5+ years in web development'
      }
    })

    console.log('\n🎉 Test users created successfully!')
    console.log('\nLogin Credentials:')
    console.log('Student: student@learnwave.com / student123')
    console.log('Admin: admin@learnwave.com / admin123')
    console.log('Mentor: mentor@learnwave.com / mentor123')

  } catch (error) {
    console.error('❌ Error creating test users:', error)
  } finally {
    await db.$disconnect()
  }
}

createTestUser()
