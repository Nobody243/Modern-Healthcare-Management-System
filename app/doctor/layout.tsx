import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DoctorLayout from '@/components/layouts/doctor-layout';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== 'doctor') {
    redirect('/unauthorized');
  }

  return (
    <DoctorLayout user={{
      name: session.name,
      email: session.email || '',
      role: session.role
    }}>
      {children}
    </DoctorLayout>
  );
}
