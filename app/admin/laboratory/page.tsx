import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LaboratoryClient from '@/components/admin/laboratory-client';

export default async function LaboratoryPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  return <LaboratoryClient />;
}
