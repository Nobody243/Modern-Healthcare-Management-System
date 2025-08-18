import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import PrescriptionsClient from '@/components/patient/prescriptions-client';

interface Prescription {
  PRES_ID: number;
  PRES_NUMBER: string;
  PRES_MEDICATION: string;
  PRES_DOSAGE: string;
  PRES_FREQUENCY: string;
  PRES_DURATION: string;
  PRES_DOC_NAME: string;
  PRES_STATUS: string;
  PRES_REFILLS_REMAINING: number;
  PRES_NOTES: string;
  PRES_DATE: string;
}

async function getPatientPrescriptions(patientNumber: string) {
  try {
    const prescriptions = await query(
      `SELECT 
        PRES_ID, PRES_NUMBER, PRES_MEDICATION, PRES_DOSAGE, PRES_FREQUENCY, 
        PRES_DURATION, PRES_DOC_NAME, PRES_DATE, PRES_STATUS, PRES_REFILLS_REMAINING, PRES_NOTES
       FROM V_PRESCRIPTIONS 
       WHERE PRES_PAT_NUMBER = :1
       ORDER BY PRES_DATE DESC`,
      [patientNumber]
    );
    return prescriptions || [];
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return [];
  }
}

export default async function PatientPrescriptions() {
  const session = await getSession();
  
  if (!session || session.role !== 'patient' || !session.patientNumber) {
    redirect('/login');
  }

  const prescriptions = await getPatientPrescriptions(session.patientNumber);

  return <PrescriptionsClient prescriptions={prescriptions} />;
}
