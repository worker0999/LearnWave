const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const db = new PrismaClient()

async function createAdmin() {
  try {
    const email = 'admin@learnwave.com'
    const password = 'admin123'

    // Check if admin already exists
    const existingAdmin = await db.users.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      console.log(`✓ Admin user already exists with email: ${email}`)
      console.log(`Admin ID: ${existingAdmin.id}`)
      console.log(`Admin Role: ${existingAdmin.role}`)
      console.log(`Active: ${existingAdmin.is_active}`)
      await db.$disconnect()
      return
    }

    // Hash password
    const saltRounds = 10
    const password_hash = await bcrypt.hash(password, saltRounds)

    // Create admin user
    const admin = await db.users.create({
      data: {
        email,
        password_hash,
        role: 'ADMIN',
        is_active: true
      }
    })

    console.log('✓ Admin credentials created successfully!')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log(`Role: ${admin.role}`)
    console.log(`User ID: ${admin.id}`)
    console.log(`Created at: ${admin.created_at}`)

    // Also create a user profile
    const userProfile = await db.user_profiles.create({
      data: {
        user_id: admin.id,
        first_name: 'Test',
        last_name: 'Admin'
      }
    })

    console.log(`Profile created: ${userProfile.id}`)

  } catch (error) {
    console.error('Error creating admin:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

createAdmin()
