import { getCurrentUser } from '@/app/lib/session';
import { redirect } from 'next/navigation';
import DashboardClient from './_dashboard-client';

export default async function Dashboard() {
  const user = await getCurrentUser();

  // If no user, redirect to login
  if (!user) {
    redirect('/login');
  }

  return <DashboardClient user={user} />;
}
