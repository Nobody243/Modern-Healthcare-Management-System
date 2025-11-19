import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import RecordsClient from '@/components/doctor/records-client';

export default async function DoctorRecordsPage() {
  const session = await getSession();

  if (!session || session.role !== 'doctor') {
    redirect('/unauthorized');
  }

  return <RecordsClient doctorId={session.doctorNumber || String(session.userId)} />;
}
