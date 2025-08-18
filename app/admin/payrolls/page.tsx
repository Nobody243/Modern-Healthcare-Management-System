import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import PayrollsClient from '@/components/admin/payrolls-client';

export default async function PayrollsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  return <PayrollsClient />;
}
