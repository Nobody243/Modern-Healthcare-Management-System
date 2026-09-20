import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import VitalsClient from '@/components/admin/vitals-client';

export default async function VitalsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  return <VitalsClient />;
}
