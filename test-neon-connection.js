// Test Neon database connection directly
const { PrismaClient } = require('@prisma/client');

const NEON_DATABASE_URL = "postgresql://neondb_owner:npg_3YrdBSPq2jJu@ep-steep-fire-a122d9sh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

console.log('🔍 Testing Neon database connection directly...');
console.log('NEON_DATABASE_URL:', NEON_DATABASE_URL?.substring(0, 50) + '...');

const db = new PrismaClient({
  datasources: {
    db: {
      url: NEON_DATABASE_URL
    }
  });

async function testNeonConnection() {
  try {
    console.log('🔗 Connecting to Neon database directly...');
    await db.$connect();
    console.log('✅ Connected to Neon database');
    
    const count = await db.user.count();
    console.log('✅ User count:', count);
    
    if (count > 0) {
      const user = await db.user.findUnique({
        where: { email: 'admin@learnwave.com' }
      });
      console.log('✅ User found:', user ? user.email : 'Not found');
    }
    
    await db.$disconnect();
    console.log('✅ Disconnected from Neon database');
    
  } catch (error) {
    console.error('❌ Neon connection failed:', error.message);
    console.error('Full error details:', error);
  }
}

testNeonConnection();