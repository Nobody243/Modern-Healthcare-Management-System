export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { queryOne } from '@/lib/db';
import DoctorProfileClient from '@/components/doctor/profile-client';

export default async function DoctorProfilePage() {
  const session = await getSession();
  
  if (!session || session.role !== 'doctor') {
    redirect('/login');
  }

  // Fetch doctor details
  const doctor = await queryOne(
    `SELECT DOC_ID, DOC_NUMBER, DOC_FNAME, DOC_LNAME, DOC_EMAIL, 
            DOC_PHONE, DOC_SPECIALIZATION, CREATED_AT
     FROM HIS_DOCS
     WHERE DOC_EMAIL = :1`,
    [session.email]
  );

  if (!doctor) {
    redirect('/login');
  }

  return <DoctorProfileClient initialDoctor={doctor} />;
}
