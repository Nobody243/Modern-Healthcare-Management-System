import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import SurgeriesClient from '@/components/patient/surgeries-client';

interface Surgery {
  SURG_ID: number;
  SURG_NUMBER: string;
  SURG_TYPE: string;
  SURG_DOC_NAME: string;
  SURG_DATE: string;
  SURG_DURATION: string;
  SURG_STATUS: string;
  SURG_NOTES: string;
}

async function getPatientSurgeries(patientNumber: string) {
  try {
    const surgeries = await query(
      `SELECT 
        SURG_ID, SURG_NUMBER, SURG_TYPE, SURG_DOC_NAME, SURG_DATE,
        SURG_DURATION, SURG_STATUS, SURG_NOTES
       FROM V_SURGERY 
       WHERE SURG_PAT_NUMBER = :1
       ORDER BY SURG_DATE DESC`,
      [patientNumber]
    );
    return surgeries || [];
  } catch (error) {
    console.error('Error fetching surgeries:', error);
    return [];
  }
}

export default async function PatientSurgeries() {
  const session = await getSession();
  
  if (!session || session.role !== 'patient' || !session.patientNumber) {
    redirect('/login');
  }

  const surgeries = await getPatientSurgeries(session.patientNumber);

  return <SurgeriesClient surgeries={surgeries} />;
}
