'use server'

import { clearInvalidSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'

export async function clearSessionAndRedirect() {
  await clearInvalidSession()
  redirect('/login')
}
