"use client"

import Link from 'next/link'
import { login } from "@/app/actions/login"
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
import { LoginFormSchema } from "@/app/lib/definitions"

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)
  const [clearedErrors, setClearedErrors] = useState<Set<string>>(new Set())

  // Reset cleared errors when form is submitted (new state received)
  useEffect(() => {
    if (state?.errors) {
      setClearedErrors(new Set())
    }
  }, [state])

  const handleInputChange = (fieldName: string, value: string) => {
    if (state?.errors?.[fieldName as keyof typeof state.errors]) {
      const fieldSchema = LoginFormSchema.shape[fieldName as keyof typeof LoginFormSchema.shape]
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

  const getFieldError = (fieldName: string) => {
    if (clearedErrors.has(fieldName)) {
      return undefined
    }

    return state?.errors?.[fieldName as keyof typeof state.errors]
  }

  const hasFieldError = (fieldName: string) => {
    const error = getFieldError(fieldName)
    return error && error.length > 0
  }

  return (
    <form action={action}>
      <Card className="w-full max-w-sm min-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state?.message && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {state.message}
            </div>
          )}
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="me@example.com"
                  defaultValue={state?.formData?.email as string || ''}
                  aria-invalid={hasFieldError('email') ? "true" : "false"}
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
                  aria-invalid={hasFieldError('password') ? "true" : "false"}
                  error={getFieldError('password')}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  showRequirements={false}
                  required
                />
              </div>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" disabled={pending} >Login</Button>
                <CardAction>
          <CardDescription>
            <Link href="/signup">Sign up for an account.</Link>
          </CardDescription>
        </CardAction>
        </CardFooter>
      </Card>
    </form>
  );
}
