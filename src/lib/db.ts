import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: any
}

function createPrismaClient() {
  try {
    return new PrismaClient({ log: ['query'] })
  } catch (err: any) {
    console.error('Prisma client initialization failed.')
    console.error('Make sure you ran `npx prisma generate` and that the generated client is present in node_modules/.prisma/client')
    console.error('If you just added Prisma or changed the schema, run: `npx prisma generate` then restart the dev server.')
    console.error('Original error:', err?.message ?? err)
    throw err
  }
}

export const db: any = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  if (!globalForPrisma.prisma) {
    console.log('🔐 Initializing new Prisma client...')
  }
  globalForPrisma.prisma = db
}

// Provide convenient model aliases to handle common singular/plural mismatches
// e.g., code expects `db.user` but schema defines `model users {}` so Prisma client has `db.users`.
; (function ensureModelAliases() {
  const clientAny = db as any
  const map: Record<string, string[]> = {
    // alias: [candidate names on generated client]
    user: ['users', 'User', 'Users'],
    userProfile: ['user_profiles', 'userProfiles', 'user_profile'],
    mentorProfile: ['mentor_profiles', 'mentorProfiles', 'mentor_profile'],
    userSettings: ['user_settings', 'userSettings', 'user_setting']
  }

  for (const alias of Object.keys(map)) {
    if (typeof clientAny[alias] === 'undefined') {
      const candidates = map[alias]
      for (const cand of candidates) {
        if (typeof clientAny[cand] !== 'undefined') {
          clientAny[alias] = clientAny[cand]
          console.log(`Prisma model alias applied: db.${alias} -> db.${cand}`)
          break
        }
      }
    }
  }

  // If nothing matched for 'user' but 'users' exists, create direct mapping as well
  if (typeof clientAny.user === 'undefined' && typeof clientAny.users !== 'undefined') {
    clientAny.user = clientAny.users
    console.log('Prisma model alias applied: db.user -> db.users')
  }
})()
