"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signup } from "@/app/actions/auth"
import { useActionState, useEffect } from 'react'
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
import { toast } from "sonner"


export default function Register() {
  const [state, action, pending] = useActionState(signup, undefined)
  const router = useRouter()

  console.log(state)

  // Handle success message and redirect
  useEffect(() => {
    if (state?.successMessage) {
      toast.success(state.successMessage, {
        duration: 2500,
      })

      // Redirect to login page after 2.5 seconds
      const redirectTimer = setTimeout(() => {
        router.push('/login')
      }, 2500)

      return () => clearTimeout(redirectTimer)
    }
  }, [state?.successMessage, router])

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
                id="name"
                name="name"
                type="text"
                label="Name"
                placeholder="Name"
                defaultValue={state?.formData?.name as string || ''}
                aria-invalid={state?.errors?.name ? "true" : "false"}
                error={state?.errors?.name}
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
          Register
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
