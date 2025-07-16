"use client"

import Link from 'next/link'
import { signup } from "@/app/actions/signup"
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

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)

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
                aria-invalid={state?.errors?.first_name ? "true" : "false"}
                error={state?.errors?.first_name}
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
                aria-invalid={state?.errors?.last_name ? "true" : "false"}
                error={state?.errors?.last_name}
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
                aria-invalid={state?.errors?.email ? "true" : "false"}
                error={state?.errors?.email}
                required
              />
            </div>
            <div className="grid gap-2">
              <FormInput
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="Password"
                defaultValue={state?.formData?.password as string || ''}
                aria-invalid={state?.errors?.password ? "true" : "false"}
                error={state?.errors?.password}
                errorListLabel="Password must:"
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
