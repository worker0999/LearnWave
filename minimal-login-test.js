const { PrismaClient } = require('@prisma/client');

const DATABASE_URL = process.env.DATABASE_URL;
console.log('DATABASE_URL:', DATABASE_URL?.substring(0, 50) + '...');

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const db = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function testLogin() {
  try {
    console.log('Testing user lookup...');
    const user = await db.user.findUnique({
      where: { email: 'admin@learnwave.com' },
      include: {
        mentorProfile: true
      }
    });
    
    if (user) {
      console.log('✅ User found:', user.email);
      console.log('User role:', user.role);
      console.log('User has password_hash:', !!user.password_hash);
    } else {
      console.log('❌ User not found');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Full error:', error);
  } finally {
    await db.$disconnect();
  }
}

testLogin();