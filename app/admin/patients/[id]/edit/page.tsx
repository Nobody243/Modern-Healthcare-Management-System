import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import PatientFormPage from '@/components/admin/patient-form-page';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPatientPage({ params }: PageProps) {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const { id } = await params;
  
  const patient = await queryOne(
    `SELECT 
      PAT_ID as "PAT_ID",
      PAT_FNAME as "PAT_FNAME",
      PAT_LNAME as "PAT_LNAME",
      PAT_NUMBER as "PAT_NUMBER",
      TO_CHAR(PAT_DOB, 'YYYY-MM-DD') as "PAT_DOB",
      PAT_AGE as "PAT_AGE",
      PAT_ADDR as "PAT_ADDR",
      PAT_PHONE as "PAT_PHONE",
      PAT_EMAIL as "PAT_EMAIL",
      PAT_TYPE as "PAT_TYPE",
      PAT_AILMENT as "PAT_AILMENT",
      PAT_DISCHARGE_STATUS as "PAT_DISCHARGE_STATUS",
      PAT_ASSIGNED_DOC as "PAT_ASSIGNED_DOC",
      PAT_GENDER as "PAT_GENDER",
      PAT_BLOOD_GROUP as "PAT_BLOOD_GROUP",
      PAT_EMERGENCY_CONTACT as "PAT_EMERGENCY_CONTACT"
    FROM HIS_PATIENTS WHERE PAT_ID = :id`,
    [id]
  );

  if (!patient) {
    redirect('/admin/patients');
  }

  return <PatientFormPage patient={patient} />;
}
