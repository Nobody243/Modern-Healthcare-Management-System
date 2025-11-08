import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PatientLayout from '@/components/layouts/patient-layout';

export default async function PatientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session || session.role !== 'patient') {
    redirect('/login');
  }

  return <PatientLayout>{children}</PatientLayout>;
}
