'use server'

export interface SessionData {
  sessionId: number
  expiresAt: string
}

export interface UserSession {
  userId: number
  user: {
    id: number
    email: string
    first_name?: string
    last_name?: string
  }
  expiresAt: string
}

/**
 * Create a new session and set it as a cookie (Server Action only)
 * @param sessionData - Encrypted session data from API
 * @param expiresAt - Session expiration date
 */
export async function createSession(sessionData: string, expiresAt: Date) {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  
  cookieStore.set('session', sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

/**
 * Get the current session from cookies (Server Component only)
 * @returns The session data or null if no session exists
 */
export async function getSession(): Promise<string | null> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  
  return sessionCookie?.value || null
}

/**
 * Verify the current session with the API
 * @returns User session data or null if invalid
 */
export async function verifySession(): Promise<UserSession | null> {
  const session = await getSession()
  
  if (!session) {
    return null
  }

  try {
    const response = await fetch(`${process.env.API_URL || 'http://api:8000'}/user-auth/verify-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.API_KEY || '',
      },
      body: JSON.stringify({ session }),
    })

    if (!response.ok) {
      // Session is invalid, but we can't delete the cookie here
      // The cookie will be deleted by the logout action or middleware
      return null
    }

    const data = await response.json()
    return {
      userId: data.userId,
      user: data.user,
      expiresAt: data.expiresAt,
    }
  } catch (error) {
    console.error('Session verification error:', error)
    return null
  }
}

/**
 * Delete the current session cookie and logout from API (Server Action only)
 */
export async function deleteSession() {
  const session = await getSession()
  
  if (session) {
    // Notify API to invalidate session
    try {
      await fetch(`${process.env.API_URL || 'http://api:8000'}/user-auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.API_KEY || '',
        },
        body: JSON.stringify({ session }),
      })
    } catch (error) {
      console.error('Logout API error:', error)
    }
  }

  // Delete the cookie
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

/**
 * Clear invalid session (Server Action only)
 * This is a separate action for clearing invalid sessions
 */
export async function clearInvalidSession() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

/**
 * Check if user is authenticated
 * @returns True if user has a valid session, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await verifySession()
  return session !== null
}

/**
 * Get current user data from session
 * @returns User data or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await verifySession()
  return session?.user || null
}
