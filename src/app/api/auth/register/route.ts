import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, generateToken } from '@/lib/auth'

// User registration endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role = 'STUDENT', usn, branch, semester } = body

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.users.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await db.users.create({
      data: {
        email,
        password_hash: hashedPassword,
        role,
        usn
      },
      select: {
        id: true,
        email: true,
        role: true,
        usn: true
      }
    })

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    return NextResponse.json({
      message: 'User registered successfully',
      user,
      token
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}