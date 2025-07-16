import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/app/lib/session';

export default async function Home() {
  // If user is not authenticated, redirect to login
  if (!(await isAuthenticated())) {
    redirect('/login');
  }

  // If authenticated, redirect to dashboard
  redirect('/dashboard');
}
