import { LoginFormSchema, LoginFormState } from '@/app/lib/definitions'

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
    const response = await fetch('http://localhost:8000/user-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

    // Authentication successful - store token and redirect
    // You might want to store the token in cookies or session storage
    // For now, we'll return success with the token
    return {
      successMessage: "Login successful!",
      token: data.token,
      user: data.user
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
  }

}
