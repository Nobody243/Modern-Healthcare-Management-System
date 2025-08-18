import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import LaboratoryClient from '@/components/patient/laboratory-client';

interface Lab {
  LAB_ID: number;
  LAB_NUMBER: string;
  LAB_PAT_TESTS: string;
  LAB_PAT_RESULTS: string;
  LAB_STATUS: string;
  LAB_DATE_REC: string;
  LAB_COMPLETED_DATE: string;
  LAB_PAT_AILMENT: string;
}

async function getPatientLabs(patientNumber: string) {
  try {
    const labs = await query(
      `SELECT 
        LAB_ID, LAB_NUMBER, LAB_PAT_TESTS, LAB_PAT_RESULTS, 
        LAB_STATUS, LAB_DATE_REC, LAB_COMPLETED_DATE, LAB_PAT_AILMENT
       FROM V_LABORATORY 
       WHERE LAB_PAT_NUMBER = :1
       ORDER BY LAB_DATE_REC DESC`,
      [patientNumber]
    );
    return labs || [];
  } catch (error) {
    console.error('Error fetching labs:', error);
    return [];
  }
}

export default async function PatientLaboratory() {
  const session = await getSession();
  
  if (!session || session.role !== 'patient' || !session.patientNumber) {
    redirect('/login');
  }

  const labs = await getPatientLabs(session.patientNumber);

  return <LaboratoryClient labs={labs} />;
}
