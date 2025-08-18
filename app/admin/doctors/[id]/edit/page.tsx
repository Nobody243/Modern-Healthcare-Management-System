import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import DoctorFormPage from '@/components/admin/doctor-form-page';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDoctorPage({ params }: PageProps) {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const { id } = await params;
  
  const doctor = await queryOne(
    `SELECT 
      DOC_ID as "DOC_ID",
      DOC_FNAME as "DOC_FNAME",
      DOC_LNAME as "DOC_LNAME",
      DOC_EMAIL as "DOC_EMAIL",
      DOC_NUMBER as "DOC_NUMBER",
      DOC_DEPT as "DOC_DEPT",
      DOC_DPIC as "DOC_DPIC",
      DOC_SPECIALIZATION as "DOC_SPECIALIZATION",
      DOC_PHONE as "DOC_PHONE",
      DOC_STATUS as "DOC_STATUS"
    FROM HIS_DOCS WHERE DOC_ID = :id`,
    [id]
  );

  if (!doctor) {
    redirect('/admin/doctors');
  }

  return <DoctorFormPage doctor={doctor} />;
}
