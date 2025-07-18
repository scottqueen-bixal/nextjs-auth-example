"use client"

import Link from 'next/link'
import { login } from "@/app/actions/login"
import { useActionState } from 'react'
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

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)

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
          {state?.successMessage && (
            <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              {state.successMessage}
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
                  aria-invalid={state?.errors?.email ? "true" : "false"}
                  error={state?.errors?.email}
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
                  aria-invalid={state?.errors?.password ? "true" : "false"}
                  error={state?.errors?.password}
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
