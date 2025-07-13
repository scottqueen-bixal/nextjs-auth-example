"use client"

import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { signup } from "@/app/actions/auth"
// import { useActionState, useEffect } from 'react'
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
  return (
  <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Login to your account</CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
      <CardAction>
        <Button variant="link"><Link href="/register">Sign Up</Link></Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <form>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="m@example.com"
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
              required
            />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter className="flex-col gap-2">
      <Button type="submit" className="w-full">
       <Link href="/dashboard">Login</Link>
      </Button>
    </CardFooter>
  </Card>
  );
}
