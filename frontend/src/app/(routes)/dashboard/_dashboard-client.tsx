"use client"

import { Button } from "@/components/ui/button"
import { logout } from '@/app/actions/logout'
import { User } from '@/app/lib/definitions'

interface DashboardClientProps {
  user: User
}

export default function DashboardClient({ user }: DashboardClientProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Protected Dashboard</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Welcome back!</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {user.email}</p>
            {user.first_name && <p><span className="font-medium">First Name:</span> {user.first_name}</p>}
            {user.last_name && <p><span className="font-medium">Last Name:</span> {user.last_name}</p>}
            <p><span className="font-medium">User ID:</span> {user.id}</p>
          </div>
        </div>

        <form action={logout}>
          <Button type="submit" variant="default">Logout</Button>
        </form>
      </div>
    </main>
  )
}
