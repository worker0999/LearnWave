import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Short-lived in-memory cache for maintenance status
let cachedMaintenance: {
  all: boolean
  student: boolean
  mentor: boolean
  admin: boolean
} | null = null
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

  // Check bypass query param or cookie (JWT_SECRET is the secure bypass passcode)
  const bypassCookie = request.cookies.get('bypass_maintenance')?.value === 'true'
  const hasBypassParam = request.nextUrl.searchParams.get('bypass') === process.env.JWT_SECRET
  const isBypassed = bypassCookie || hasBypassParam

  // If they have the bypass parameter in URL, redirect to clean it from URL and set cookie
  if (hasBypassParam) {
    const url = new URL(request.url)
    url.searchParams.delete('bypass')
    const redirectResponse = NextResponse.redirect(url)
    redirectResponse.cookies.set('bypass_maintenance', 'true', { maxAge: 3600, path: '/' })
    return redirectResponse
  }

  // Fetch Maintenance Mode status
  let maintenanceMode = false
  let studentMaintenance = false
  let mentorMaintenance = false
  let adminMaintenance = false
  const now = Date.now()

  if (cachedMaintenance !== null && now < cacheExpiry) {
    maintenanceMode = cachedMaintenance.all
    studentMaintenance = cachedMaintenance.student
    mentorMaintenance = cachedMaintenance.mentor
    adminMaintenance = cachedMaintenance.admin
  } else {
    try {
      // Need absolute URL in proxy
      const baseUrl = request.nextUrl.origin
      const res = await fetch(`${baseUrl}/api/settings/public`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        maintenanceMode = data.maintenanceMode
        studentMaintenance = data.studentMaintenanceMode
        mentorMaintenance = data.mentorMaintenanceMode
        adminMaintenance = data.adminMaintenanceMode

        cachedMaintenance = {
          all: maintenanceMode,
          student: studentMaintenance,
          mentor: mentorMaintenance,
          admin: adminMaintenance
        }
        cacheExpiry = now + CACHE_TTL_MS
      }
    } catch (error) {
      console.error('Failed to fetch maintenance mode status in proxy:', error)
      if (cachedMaintenance !== null) {
        maintenanceMode = cachedMaintenance.all
        studentMaintenance = cachedMaintenance.student
        mentorMaintenance = cachedMaintenance.mentor
        adminMaintenance = cachedMaintenance.admin
      }
    }
  }

  // Handle Maintenance Mode
  if (pathname !== '/maintenance') {
    let shouldRedirect = false

    // General maintenance blocks everyone except ADMINs
    if (maintenanceMode && decodedToken?.role !== 'ADMIN') {
      shouldRedirect = true
    }

    // Student portal maintenance blocks students
    if (studentMaintenance && pathname.startsWith('/student') && decodedToken?.role !== 'ADMIN') {
      shouldRedirect = true
    }

    // Mentor portal maintenance blocks mentors
    if (mentorMaintenance && pathname.startsWith('/mentor') && decodedToken?.role !== 'ADMIN') {
      shouldRedirect = true
    }

    // Admin portal maintenance blocks admins unless bypassed
    if (adminMaintenance && pathname.startsWith('/admin')) {
      if (!isBypassed) {
        shouldRedirect = true
      }
    }

    if (shouldRedirect) {
      return NextResponse.redirect(new URL('/maintenance', request.url))
    }
  }

  // If maintenance mode is OFF but trying to access maintenance page, redirect to home
  const isAnyMaintenanceActive = maintenanceMode || studentMaintenance || mentorMaintenance || adminMaintenance
  if (pathname === '/maintenance') {
    if (!isAnyMaintenanceActive || (adminMaintenance && isBypassed && decodedToken?.role === 'ADMIN')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
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
