import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import PatientFormPage from '@/components/admin/patient-form-page';

export default async function NewPatientPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  return <PatientFormPage />;
}
