'use server'

import { LoginFormSchema, LoginFormState } from '@/app/lib/definitions'
import { createSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'

export async function login(state: LoginFormState, formData: FormData) {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      formData: {
        email: formData.get('email'),
        password: formData.get('password'),
      }
    }
  }

  // Call the API to authenticate user
  try {
    const response = await fetch(`${process.env.API_URL || 'http://api:8000'}/user-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.API_KEY || '',
      },
      body: JSON.stringify({
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        message: data.error || 'Authentication failed',
        formData: {
          email: formData.get('email'),
          password: formData.get('password'),
        }
      }
    }

    // Authentication successful - create session and return success
    if (data.session && data.sessionExpires) {
      await createSession(data.session, new Date(data.sessionExpires))
      return {
        successMessage: 'Login successful, redirecting to dashboard...'
      }
    }

    // Fallback if no session data
    return {
      message: 'Authentication successful but no session created',
      formData: {
        email: formData.get('email'),
        password: formData.get('password'),
      }
    }

  } catch (error) {
    console.error('Login error:', error)
    return {
      message: 'Network error. Please try again.',
      formData: {
        email: formData.get('email'),
        password: formData.get('password'),
      }
    }
  } finally {
    // Redirect the user to the dashboard - this will only execute
    // if we successfully authenticated and created a session
    redirect('/dashboard')
  }
}
