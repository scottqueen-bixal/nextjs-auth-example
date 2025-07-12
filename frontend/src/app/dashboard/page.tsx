import Link from 'next/link'
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <main>
      <div>Protected Dashboard</div>
      <Button variant="default"><Link href="/login">Logout</Link></Button>
    </main>
  );
}
