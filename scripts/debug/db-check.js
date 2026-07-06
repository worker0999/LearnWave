// Lightweight DB check using Prisma client
// Usage: node scripts\db-check.js  (make sure DATABASE_URL is set or use .env)
const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL
console.log('=== DB CHECK ===')
console.log('DATABASE_URL present:', !!DATABASE_URL)
console.log('DATABASE_URL preview:', DATABASE_URL ? DATABASE_URL.substring(0, 60) + '...' : '')

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set. Copy .env.example to .env and fill in credentials.')
  process.exit(1)
}

const db = new PrismaClient()

async function run() {
  try {
    console.log('Connecting with Prisma...')
    await db.$connect()
    console.log('Connected ✅')

    // Try a simple count on a likely table. We try multiple candidate model names.
    const candidates = ['user', 'users', 'User', 'Users']
    for (const model of candidates) {
      try {
        // Access model dynamically
        if (typeof db[model] !== 'undefined') {
          const count = await db[model].count()
          console.log(`Model '${model}' exists. Count:`, count)
        } else {
          console.log(`Model '${model}' not found on Prisma client.`)
        }
      } catch (err) {
        console.log(`Error querying model '${model}':`, err.message)
      }
    }

    await db.$disconnect()
    console.log('Disconnected')
  } catch (err) {
    console.error('Prisma connection error:', err.message)
    console.error(err)
    process.exit(1)
  }
}

run()
