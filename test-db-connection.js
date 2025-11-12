// Test DATABASE_URL existence and validity
console.log('=== DATABASE_URL CHECK ===');
console.log('🔍 DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('🔍 DATABASE_URL type:', typeof process.env.DATABASE_URL);
console.log('🔍 DATABASE_URL length:', process.env.DATABASE_URL?.length);
console.log('🔍 DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 10) + '...');
console.log('🔍 DATABASE_URL type:', typeof process.env.DATABASE_URL);
console.log('🔍 Is PostgreSQL URL:', isValidPostgresUrl);

// Test if DATABASE_URL is properly formatted
const isValidPostgresUrl = process.env.DATABASE_URL?.startsWith('postgresql://') || process.env.DATABASE_URL?.startsWith('postgres://');

if (!isValidPostgresUrl) {
  console.error('❌ DATABASE_URL is not a valid PostgreSQL connection string');
  console.log('🔧 DATABASE_URL format check failed');
} else {
  console.log('✅ DATABASE_URL is valid PostgreSQL connection string');
}

// Test if DATABASE_URL is accessible
try {
  console.log('🔍 Testing DATABASE_URL accessibility...');
  const response = await fetch('https://http-postgres.connect.neon.tech:5432', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your_token_here'
    }
  });
    
    console.log('🔍 PostgreSQL status:', response.status);
    
    if (response.ok) {
      console.log('✅ PostgreSQL connection successful');
      const data = await response.json();
      console.log('✅ Direct PostgreSQL connection successful');
    } else {
      console.log('❌ Direct PostgreSQL connection failed:', response.status);
    }
    
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
      console.error('Full error details:', error);
    }
}

// Test 3: Test with fetch to PostgreSQL database
try {
  console.log('🔍 Testing PostgreSQL fetch...');
  const response = await fetch('https://http-postgres.connect.neon.tech:5432', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your_token_here'
    }
  });
    
    console.log('🔍 PostgreSQL fetch status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ PostgreSQL fetch successful');
    } else {
      console.log('❌ PostgreSQL fetch failed:', response.status);
    }
    
    return NextResponse.json({
      error: 'Database connection failed',
      status: 500
    });
  }
}

testConnection();