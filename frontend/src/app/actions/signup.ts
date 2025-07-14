import { SignupFormSchema, SignupFormState } from '@/app/lib/definitions'

export async function signup(state: SignupFormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      formData: {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        password: formData.get('password'),
      }
    }
  }

  // Call the provider or db to create a user...
  try {
    // Use the validated first_name and last_name directly
    const response = await fetch('http://localhost:8000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: validatedFields.data.first_name,
        last_name: validatedFields.data.last_name,
        email: validatedFields.data.email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Handle specific error cases
      if (response.status === 409) {
        return {
          errors: {
            email: ['Email already exists'],
          },
          formData: {
            first_name: validatedFields.data.first_name,
            last_name: validatedFields.data.last_name,
            email: validatedFields.data.email,
            password: validatedFields.data.password,
          }
        };
      }

      // Handle other errors
      return {
        message: errorData.error || 'Failed to create user',
        formData: {
          first_name: validatedFields.data.first_name,
          last_name: validatedFields.data.last_name,
          email: validatedFields.data.email,
          password: validatedFields.data.password,
        }
      };
    }

    await response.json(); // Consume the response

    // Return success message
    return {
      successMessage: "User successfully created, redirecting you to the log in page"
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      message: 'Network error. Please try again.',
      formData: {
        first_name: validatedFields.data.first_name,
        last_name: validatedFields.data.last_name,
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      }
    };
  }

}
