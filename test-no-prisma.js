// Test database connection without Prisma client
console.log('🔍 Testing database connection without Prisma client...');

// Test basic connection
try {
  console.log('🔗 Testing database connection without Prisma client...');
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
    console.error('❌ Connection failed:', error.message);
    console.error('Full error details:', error);
  }
}

testConnection();