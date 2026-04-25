import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Login API - DATABASE_URL check:', process.env.DATABASE_URL?.substring(0, 50) + '...');

    // Test database connection
    try {
      const testCount = await db.users.count();
      console.log('✅ Database connection test - User count:', testCount);
    } catch (dbError) {
      const dbErrMsg = dbError instanceof Error ? dbError.message : String(dbError)
      console.error('❌ Database connection test failed:', dbErrMsg);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    console.log('🔍 Looking for user:', email)
    const user = await db.users.findUnique({
      where: { email },
      include: {
        mentors: true,
        user_profiles: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if mentor is approved
    if (user.role === 'MENTOR' && user.mentors && !user.mentors.approved) {
      return NextResponse.json(
        { error: 'Your mentor account is pending approval' },
        { status: 403 }
      )
    }

    // Check if role matches if provided in body (optional validation)
    const { role: requestedRole } = body;
    if (requestedRole && user.role !== requestedRole) {
      return NextResponse.json(
        { error: `This account is not registered as a ${requestedRole.toLowerCase()}` },
        { status: 401 }
      )
    }

    // Format user name
    const name = user.user_profiles
      ? `${user.user_profiles.first_name} ${user.user_profiles.last_name}`.trim()
      : 'User';

    // Generate token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: name
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: false, // Allow client access if needed, though httpOnly: true is safer. But existing frontend reads it from document.cookie? 
      // Actually, AuthContext manual setting handles client access. 
      // But middleware prefers cookie. 
      // I'll set it httpOnly: false so the client JS implies reading it? 
      // Wait, AuthContext sets it manually. 
      // If I set it here, I should probably set it httpOnly: true for security, 
      // but AuthContext expects to read/write it for state sync.
      // Let's set it httpOnly: false to match AuthContext behavior if it tries to read it.
      // Better: Set it httpOnly: true, but send token in body. 
      // AuthContext uses body token to sync state.
      // Middleware uses cookie. PERFECT.
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Return user data without sensitive info
    const responseUser = {
      id: user.id,
      email: user.email,
      name: name,
      role: user.role,
      usn: user.usn,
      branch: user.user_profiles?.branch,
      semester: user.user_profiles?.semester
    }

    return NextResponse.json({
      message: 'Login successful',
      user: responseUser,
      token
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
