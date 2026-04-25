import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/mentor-success', '/']

  // Protected routes
  const protectedRoutes = ['/admin', '/student', '/mentor']
  const adminRoutes = ['/admin']
  const mentorRoutes = ['/mentor']
  const studentRoutes = ['/student']

  // Check if the path is public
  const exactPublicRoutes = ['/', '/auth/login', '/auth/register', '/auth/mentor-success']
  if (exactPublicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check if the path is protected
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Get token from cookie first (most reliable for middleware)
    let token = request.cookies.get('token')?.value

    // Fallback to authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      console.log('No token found in middleware, redirecting to login')
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    try {
      const payload = await verifyToken(token)
      if (!payload) {
        console.log('Invalid token in middleware, redirecting to login')
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }

      console.log('Middleware: Token verified for user:', payload.email, 'role:', payload.role)

      // Check role-based access
      if (adminRoutes.some(route => pathname.startsWith(route)) && payload.role !== 'ADMIN') {
        console.log('Access denied: User not admin')
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }

      if (mentorRoutes.some(route => pathname.startsWith(route)) && payload.role !== 'MENTOR') {
        console.log('Access denied: User not mentor')
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }

      if (studentRoutes.some(route => pathname.startsWith(route)) && payload.role !== 'STUDENT') {
        console.log('Access denied: User not student')
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }

      // Add user info to headers for server-side usage
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.userId)
      requestHeaders.set('x-user-email', payload.email)
      requestHeaders.set('x-user-role', payload.role)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      console.error('Middleware error:', error)
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
