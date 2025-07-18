import { z } from 'zod'

export interface User {
  id: number
  email: string
  first_name?: string
  last_name?: string
  created_at?: string
  updated_at?: string
}

export const SignupFormSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters long.' })
    .trim(),
  last_name: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters long.' })
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

// Password validation utilities
export const passwordValidationRules = {
  minLength: 8,
  letterRegex: /[a-zA-Z]/,
  numberRegex: /[0-9]/,
  specialRegex: /[^a-zA-Z0-9]/
} as const

export const passwordErrorMessages = {
  length: 'Be at least 8 characters long',
  letter: 'Contain at least one letter.',
  number: 'Contain at least one number.',
  special: 'Contain at least one special character.'
} as const

export type PasswordRequirement = keyof typeof passwordErrorMessages

/**
 * Validate password requirements against the defined rules
 * @param password - The password string to validate
 * @returns Set of password requirements that are met
 */
export function validatePasswordRequirements(password: string): Set<PasswordRequirement> {
  const requirements = {
    length: password.length >= passwordValidationRules.minLength,
    letter: passwordValidationRules.letterRegex.test(password),
    number: passwordValidationRules.numberRegex.test(password),
    special: passwordValidationRules.specialRegex.test(password)
  }

  const metRequirements = new Set<PasswordRequirement>()
  if (requirements.length) metRequirements.add('length')
  if (requirements.letter) metRequirements.add('letter')
  if (requirements.number) metRequirements.add('number')
  if (requirements.special) metRequirements.add('special')

  return metRequirements
}

/**
 * Filter password errors based on which requirements are already met
 * @param originalErrors - Array of error messages from validation
 * @param metRequirements - Set of requirements that are already met
 * @returns Filtered array of error messages for unmet requirements only
 */
export function filterPasswordErrors(
  originalErrors: string[],
  metRequirements: Set<PasswordRequirement>
): string[] {
  // Create reverse mapping from error message to requirement type
  const errorMap: Record<string, PasswordRequirement> = {}
  Object.entries(passwordErrorMessages).forEach(([requirement, message]) => {
    errorMap[message] = requirement as PasswordRequirement
  })

  return originalErrors.filter(error => {
    const requirement = errorMap[error]
    return requirement ? !metRequirements.has(requirement) : true
  })
}

/**
 * Check if all password requirements are met
 * @param password - The password string to check
 * @returns True if all requirements are met, false otherwise
 */
export function isPasswordValid(password: string): boolean {
  const metRequirements = validatePasswordRequirements(password)
  const totalRequirements = Object.keys(passwordErrorMessages).length
  return metRequirements.size === totalRequirements
}

export type SignupFormState =
  | {
      errors?: {
        first_name?: string[]
        last_name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
      successMessage?: string
      formData?: {
        first_name?: FormDataEntryValue | null
        last_name?: FormDataEntryValue | null
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
        token?: string
        user?: User
        formData?: {
          email?: FormDataEntryValue | null
          password?: FormDataEntryValue | null
        }
      }
    | undefined
