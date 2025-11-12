// Test with minimal connection string
const DATABASE_URL = "postgresql://neondb_owner:npg_3YrdBSPq2jJu@ep-steep-fire-a122d9sh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

console.log('🔍 Testing minimal connection string...');
console.log('DATABASE_URL:', DATABASE_URL?.substring(0, 50) + '...');

// Try a simple connection without Prisma client
const db = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  });

async function testConnection() {
  try {
    console.log('🔗 Testing minimal connection...');
    await db.$connect();
    console.log('✅ Connected to database');
    
    const count = await db.user.count();
    console.log('✅ User count:', count);
    
    if (count > 0) {
      const user = await db.user.findUnique({
        where: { email: 'admin@learnwave.com' }
      });
      console.log('✅ User found:', user ? user.email : 'Not found');
    }
    
    await db.$disconnect();
    console.log('✅ Disconnected');
    
  } catch (error) {
    console.error('❌ Minimal connection failed:', error.message);
    console.error('Full error details:', error);
  }
}

testConnection();