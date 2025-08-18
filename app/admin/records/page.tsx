import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import RecordsClient from '@/components/admin/records-client';

export default async function MedicalRecordsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  return <RecordsClient />;
}
