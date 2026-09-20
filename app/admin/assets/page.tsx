import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AssetsClient from '@/components/admin/assets-client';

export default async function AssetsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  return <AssetsClient />;
}
