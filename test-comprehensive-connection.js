// Test DATABASE_URL validation
console.log('🔍 DATABASE_URL check:', process.env.DATABASE_URL?.substring(0, 50) + '...');
console.log('🔍 DATABASE_URL type:', typeof process.env.DATABASE_URL);
console.log('🔍 DATABASE_URL length:', process.env.DATABASE_URL?.length);
console.log('🔍 DATABASE_URL starts with:', process.env.DATABASE_URL?.startsWith('postgresql://'));
console.log('🔍 Is valid PostgreSQL URL:', isValidPostgresUrl);

if (isValidPostgresUrl) {
  console.log('✅ DATABASE_URL is valid PostgreSQL connection string');
} else {
  console.error('❌ DATABASE_URL is not a valid PostgreSQL connection string');
  console.log('🔍 DATABASE_URL format issue:', process.env.DATABASE_URL);
}

// Test 3: Try simple connection
const { PrismaClient } = require('@prisma/client');

async function testSimpleConnection() {
  try {
    console.log('🔗 Testing Prisma client...');
    await db.$connect();
    console.log('✅ Prisma client connected');
    
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
    console.error('❌ Prisma client failed:', error.message);
      console.error('Full error details:', error);
    }
  }
}

async function testBasicConnection() {
  try {
    console.log('🔍 Testing basic database connection...');
    await db.$connect();
    console.log('✅ Prisma client connected');
    
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
    console.error('❌ Prisma client failed:', error.message);
      console.error('Full error details:', error);
    }
  }
}

async function runAllTests() {
  console.log('\n=== RUNNING ALL TESTS ===');
  
  await testBasicConnection();
  await testBasicConnection();
  await testBasicConnection();
  await testBasicConnection();
  await testBasicConnection();
}

runAllTests();