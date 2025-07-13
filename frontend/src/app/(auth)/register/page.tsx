"use client"

import Link from 'next/link'
import { signup } from "@/app/actions/auth"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorMessage } from "@/components/ui/error-message"


export default function Register() {
  const [state, action, pending] = useActionState(signup, undefined)

  console.log(state)

  return (
  <form action={action}>
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create a new account</CardTitle>
        <CardDescription>
          Enter your email below to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
          <div className="flex flex-col gap-6">
          <div className="grid gap-2">
              <Label htmlFor="name" required>Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                defaultValue={state?.formData?.name as string || ''}
                required
              />
              {
                state?.errors?.name &&
                  <ErrorMessage>{state.errors.name}</ErrorMessage>
              }
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" required>Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="me@example.com"
                defaultValue={state?.formData?.email as string || ''}
                required
              />
              {
                state?.errors?.email &&
                  <ErrorMessage>{state.errors.email}</ErrorMessage>
              }
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" required>Password</Label>
              </div>
              <Input id="password" name="password" type="password" placeholder='Password' defaultValue={state?.formData?.password as string || ''} required />
                {state?.errors?.password && (
                  <div>
                    <p>
                      <small>Password must:</small>
                      </p>
                    <ul>
                      {state.errors.password.map((error) => (
                        <li key={error}><ErrorMessage>- {error}</ErrorMessage>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
