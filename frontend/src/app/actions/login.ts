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

  // Call the provider or db to create a user...

  // Return success message
  return {
    successMessage: "Logging in..."
  }

}
