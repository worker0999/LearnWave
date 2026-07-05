import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

import { NextRequest } from 'next/server'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined')
}
const JWT_SECRET = process.env.JWT_SECRET
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET)

export interface JWTPayload {
  userId: string
  email: string
  role: string
  name?: string
  [key: string]: any
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function generateToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload as unknown as JWTPayload
  } catch (error) {
    console.error('Verify Token Error:', error)
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    if (token && token !== 'null' && token !== 'undefined') {
      return token
    }
  }
  return request.cookies.get('token')?.value || null
}
