// Test database connection without Prisma client
console.log('🔍 Testing database connection without Prisma client...');

const DATABASE_URL = "postgresql://neondb_owner:npg_3YrdBSPq2jJu@ep-steep-fire-a122d9sh-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

console.log('DATABASE_URL:', DATABASE_URL?.substring(0, 50) + '...');

async function testConnection() {
  try {
    console.log('🔗 Connecting to database...');
    
    // Use fetch to test database connection
    const response = await fetch('https://http://http-postgres.connect.neon.tech:5432', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your_token_here'
      },
      body: JSON.stringify({
        query: 'SELECT 1 as count FROM users'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Database connection via fetch successful');
      console.log('✅ User count:', data.data[0].count);
    } else {
      console.error('❌ Database connection via fetch failed');
      console.log('Response status:', response.status);
    }
    
  } catch (error) {
      console.error('❌ Fetch connection failed:', error.message);
    console.error('Full error details:', error);
    }
}

testConnection();