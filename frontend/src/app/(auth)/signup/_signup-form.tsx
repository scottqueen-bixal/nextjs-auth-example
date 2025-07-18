"use client"

import Link from 'next/link'
import { signup } from "@/app/actions/signup"
import { useActionState, useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FormInput } from "@/components/ui/form-input"
import { PasswordInput } from "@/components/ui/password-input"
import { SignupFormSchema } from "@/app/lib/definitions"

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)
  const [clearedErrors, setClearedErrors] = useState<Set<string>>(new Set())
  const [passwordRequirementsMet, setPasswordRequirementsMet] = useState<Set<string>>(new Set())

  // Reset cleared errors when form is submitted (new state received)
  useEffect(() => {
    if (state?.errors) {
      setClearedErrors(new Set())
      setPasswordRequirementsMet(new Set())
    }
  }, [state])

  const validatePasswordRequirements = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      letter: /[a-zA-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password)
    }

    const metRequirements = new Set<string>()
    if (requirements.length) metRequirements.add('length')
    if (requirements.letter) metRequirements.add('letter')
    if (requirements.number) metRequirements.add('number')
    if (requirements.special) metRequirements.add('special')

    return metRequirements
  }

  const filterPasswordErrors = (originalErrors: string[]) => {
    const errorMap = {
      'Be at least 8 characters long': 'length',
      'Contain at least one letter.': 'letter',
      'Contain at least one number.': 'number',
      'Contain at least one special character.': 'special'
    }

    return originalErrors.filter(error => {
      const requirement = errorMap[error as keyof typeof errorMap]
      return requirement ? !passwordRequirementsMet.has(requirement) : true
    })
  }

  const handleInputChange = (fieldName: string, value: string) => {
    if (state?.errors?.[fieldName as keyof typeof state.errors]) {
      if (fieldName === 'password') {
        // Handle password validation specially
        const metRequirements = validatePasswordRequirements(value)
        setPasswordRequirementsMet(metRequirements)

        // Clear password error only if all requirements are met
        if (metRequirements.size === 4) {
          setClearedErrors(prev => new Set(prev).add(fieldName))
        } else {
          setClearedErrors(prev => {
            const newSet = new Set(prev)
            newSet.delete(fieldName)
            return newSet
          })
        }
      } else if (fieldName === 'email') {
        // For email field, always allow clearing errors when user types
        // This allows them to correct duplicate email errors
        const fieldSchema = SignupFormSchema.shape[fieldName as keyof typeof SignupFormSchema.shape]
        const result = fieldSchema.safeParse(value)

        if (result.success) {
          setClearedErrors(prev => new Set(prev).add(fieldName))
        } else {
          setClearedErrors(prev => {
            const newSet = new Set(prev)
            newSet.delete(fieldName)
            return newSet
          })
        }
      } else {
        // Handle other fields normally
        const fieldSchema = SignupFormSchema.shape[fieldName as keyof typeof SignupFormSchema.shape]
        const result = fieldSchema.safeParse(value)

        if (result.success) {
          setClearedErrors(prev => new Set(prev).add(fieldName))
        } else {
          setClearedErrors(prev => {
            const newSet = new Set(prev)
            newSet.delete(fieldName)
            return newSet
          })
        }
      }
    }
  }

  const getFieldError = (fieldName: string) => {
    if (clearedErrors.has(fieldName)) {
      return undefined
    }

    const originalError = state?.errors?.[fieldName as keyof typeof state.errors]
    if (fieldName === 'password' && originalError && Array.isArray(originalError)) {
      const filteredErrors = filterPasswordErrors(originalError)
      return filteredErrors.length > 0 ? filteredErrors : undefined
    }

    return originalError
  }

  return (
    <form action={action}>
    <Card className="w-full max-w-sm min-w-sm">
      <CardHeader>
        <CardTitle>Create a new account</CardTitle>
        <CardDescription>
          Enter your email below to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <FormInput
                id="first_name"
                name="first_name"
                type="text"
                label="First Name"
                placeholder="First Name"
                defaultValue={state?.formData?.first_name as string || ''}
                aria-invalid={getFieldError('first_name') ? "true" : "false"}
                error={getFieldError('first_name')}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <FormInput
                id="last_name"
                name="last_name"
                type="text"
                label="Last Name"
                placeholder="Last Name"
                defaultValue={state?.formData?.last_name as string || ''}
                aria-invalid={getFieldError('last_name') ? "true" : "false"}
                error={getFieldError('last_name')}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="me@example.com"
                defaultValue={state?.formData?.email as string || ''}
                aria-invalid={getFieldError('email') ? "true" : "false"}
                error={getFieldError('email')}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <PasswordInput
                id="password"
                name="password"
                label="Password"
                placeholder="Password"
                defaultValue={state?.formData?.password as string || ''}
                aria-invalid={getFieldError('password') ? "true" : "false"}
                error={getFieldError('password')}
                errorListLabel="Password must:"
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>
          </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" disabled={pending} className="w-full">
          Sign up
        </Button>
        <CardAction>
          <CardDescription>
            <Link href="/login">Already have an account? Try logging in.</Link>
          </CardDescription>
        </CardAction>
      </CardFooter>
    </Card>
  </form>
  );
}
