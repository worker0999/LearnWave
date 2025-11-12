// Simple login API test without database
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
    
    // Hardcoded admin check
    if (email === 'admin@learnwave.com' && password === 'admin123') {
      console.log('✅ Admin credentials verified');
      return NextResponse.json({
        message: 'Login successful',
        user: {
          id: 'admin_001',
          email: 'admin@llarnwave.com',
          name: 'LearnWave Admin',
          role: 'ADMIN'
        },
        token: 'test_token_456'
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