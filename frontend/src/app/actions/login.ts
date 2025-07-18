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
      // Map API errors to field-specific errors for better UX
      if (response.status === 404) {
        // "User not found" - associate with email field
        return {
          errors: {
            email: ['User not found']
          },
          formData: {
            email: formData.get('email'),
            password: formData.get('password'),
          }
        }
      } else if (response.status === 401) {
        // "Invalid password" - associate with password field
        return {
          errors: {
            password: ['Invalid password']
          },
          formData: {
            email: formData.get('email'),
            password: formData.get('password'),
          }
        }
      } else {
        // For other errors (500, etc.), show as general message
        return {
          message: data.error || 'Authentication failed. Please try again.',
          formData: {
            email: formData.get('email'),
            password: formData.get('password'),
          }
        }
      }
    }

    // Authentication successful - create session
    if (data.session && data.sessionExpires) {
      await createSession(data.session, new Date(data.sessionExpires))
      // Redirect will be handled outside try-catch to avoid NEXT_REDIRECT error logging
    } else {
      // Fallback if no session data
      return {
        message: 'Authentication successful but no session created',
        formData: {
          email: formData.get('email'),
          password: formData.get('password'),
        }
      }
    }

  } catch (error) {
    console.error('Login error:', error)
    return {
      message: 'Unable to connect to the server. Please check your connection and try again.',
      formData: {
        email: formData.get('email'),
        password: formData.get('password'),
      }
    }
  }

  // Redirect after successful authentication (outside try-catch)
  redirect('/dashboard')
}
