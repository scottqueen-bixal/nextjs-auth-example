import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')
  const hasSession = !!sessionCookie?.value
  
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard')

  // For protected pages, redirect to login if no session cookie
  if (!hasSession && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // For auth pages, let them handle the logic themselves
  // Don't redirect based on session cookie presence since we can't validate it here
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup']
}
