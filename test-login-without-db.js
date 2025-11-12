// Test login API without database connection
console.log('🔍 Testing login API without database...');

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    console.log('🔍 Login attempt for:', email);
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    }
    
    // Hardcoded admin user check for testing
    if (email === 'admin@learnwave.com' && password === 'admin123') {
      console.log('✅ Hardcoded admin credentials verified');
      return NextResponse.json({
        message: 'Login successful',
        user: {
          id: 'admin_001',
          email: 'admin@learnwave.com',
          name: 'LearnWave Admin',
          role: 'ADMIN'
        },
        token: 'test_token_123456'
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}