import { z } from 'zod'

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})

export type SignupFormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
      successMessage?: string
      formData?: {
        name?: FormDataEntryValue | null
        email?: FormDataEntryValue | null
        password?: FormDataEntryValue | null
      }
    }
  | undefined

  export const LoginFormSchema = z.object({
    email: z.email({ message: 'Please enter a valid email.' }).min(1, { message: 'Please enter the email registered with your user account.' }).trim(),
    password: z.string().min(1, { message: 'Please enter the password registered with your user account.' }).trim(),
  })

  export type LoginFormState =
    | {
        errors?: {
          email?: string[]
          password?: string[]
        }
        message?: string
        successMessage?: string
        formData?: {
          email?: FormDataEntryValue | null
          password?: FormDataEntryValue | null
        }
      }
    | undefined
