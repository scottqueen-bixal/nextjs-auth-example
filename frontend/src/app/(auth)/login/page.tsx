"use client"

import Link from 'next/link'
// import { useRouter } from 'next/navigation'
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
// import { toast } from "sonner"


export default function Login() {
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
