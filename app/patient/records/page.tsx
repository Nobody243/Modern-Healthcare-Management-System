export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import RecordsClient from '@/components/patient/records-client';

interface MedicalRecord {
  MDR_ID: number;
  MDR_NUMBER: string;
  MDR_PAT_AILMENT: string;
  MDR_DIAGNOSIS: string;
  MDR_TREATMENT_PLAN: string;
  MDR_PAT_PRESCR: string;
  MDR_DATE_REC: string;
  MDR_DOC_NUMBER: string;
  DOC_NAME: string;
  PRES_MEDICATION?: string;
  PRES_DOSAGE?: string;
  PRES_FREQUENCY?: string;
  PRES_DURATION?: string;
  PRES_NOTES?: string;
}

async function getPatientRecords(patientNumber: string) {
  try {
    const records = await query(
      `SELECT 
        m.MDR_ID, m.MDR_NUMBER, m.MDR_PAT_AILMENT, m.MDR_DOC_NUMBER, m.MDR_PAT_PRESCR,
        m.MDR_DIAGNOSIS, m.MDR_TREATMENT_PLAN, m.MDR_DATE_REC, m.MDR_DOC_NAME AS DOC_NAME,
        p.PRES_MEDICATION, p.PRES_DOSAGE, p.PRES_FREQUENCY, p.PRES_DURATION, p.PRES_NOTES
       FROM V_MEDICAL_RECORDS m
       LEFT JOIN HIS_PRESCRIPTIONS p ON m.MDR_PAT_PRESCR = p.PRES_NUMBER
       WHERE m.MDR_PAT_NUMBER = :1
       ORDER BY m.MDR_DATE_REC DESC`,
      [patientNumber]
    );
    return records || [];
  } catch (error) {
    console.error('Error fetching records:', error);
    return [];
  }
}

export default async function PatientRecords() {
  const session = await getSession();
  
  if (!session || session.role !== 'patient' || !session.patientNumber) {
    redirect('/login');
  }

  const records = await getPatientRecords(session.patientNumber);

  return <RecordsClient records={records} />;
}
