import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Short-lived in-memory cache for maintenance status
let cachedMaintenanceMode: boolean | null = null
let cacheExpiry = 0
const CACHE_TTL_MS = 30000 // 30 seconds

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files, images, api, and _next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)
  ) {
    return NextResponse.next()
  }

  // Get the token from cookies
  const token = request.cookies.get('token')?.value
  let decodedToken: any = null

  if (token) {
    decodedToken = await verifyToken(token)
  }

  // Fetch Maintenance Mode status
  let maintenanceMode = false
  const now = Date.now()
  if (cachedMaintenanceMode !== null && now < cacheExpiry) {
    maintenanceMode = cachedMaintenanceMode
  } else {
    try {
      // Need absolute URL in proxy
      const baseUrl = request.nextUrl.origin
      const res = await fetch(`${baseUrl}/api/settings/public`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        maintenanceMode = data.maintenanceMode
        cachedMaintenanceMode = maintenanceMode
        cacheExpiry = now + CACHE_TTL_MS
      }
    } catch (error) {
      console.error('Failed to fetch maintenance mode status in proxy:', error)
      if (cachedMaintenanceMode !== null) {
        maintenanceMode = cachedMaintenanceMode
      }
    }
  }

  // Handle Maintenance Mode
  if (maintenanceMode && pathname !== '/maintenance') {
    // If user is ADMIN, allow access
    if (decodedToken?.role === 'ADMIN') {
      return NextResponse.next()
    }
    // Otherwise redirect to maintenance page
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  // If maintenance mode is OFF but trying to access maintenance page, redirect to home
  if (!maintenanceMode && pathname === '/maintenance') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Require auth for certain routes
  const protectedRoutes = ['/admin', '/student', '/mentor', '/profile']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !decodedToken) {
    return NextResponse.redirect(new URL('/', request.url)) // redirect to login (home)
  }

  // Admin route protection
  if (pathname.startsWith('/admin') && decodedToken?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Mentor route protection
  if (pathname.startsWith('/mentor') && decodedToken?.role !== 'MENTOR') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Student route protection
  if (pathname.startsWith('/student') && decodedToken?.role !== 'STUDENT') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
