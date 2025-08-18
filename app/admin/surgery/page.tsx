import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SurgeryClient from '@/components/admin/surgery-client';

export default async function SurgeryPage() {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  return <SurgeryClient />;
}
