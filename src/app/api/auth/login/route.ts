import { NextRequest, NextResponse } from 'next/server'
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
        mentors: true
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

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
      // Note: name field is in user_profiles, not users table
    })

    // Return user data without password
    const { password_hash: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
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