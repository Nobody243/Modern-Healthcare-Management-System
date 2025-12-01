import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import DoctorFormPage from '@/components/admin/doctor-form-page';

export default async function NewDoctorPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  return <DoctorFormPage />;
}
