import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import VitalsClient from '@/components/patient/vitals-client';

interface Vital {
  VIT_ID: number;
  VIT_BODYTEMP: number;
  VIT_BLOOD_PRESSURE: string;
  VIT_HEARTPULSE: number;
  VIT_OXYGEN_SAT: number;
  VIT_RESPIRATION: number;
  VIT_WEIGHT: number;
  VIT_RECORDED_DATE: string;
  VIT_RECORDED_BY: string;
}

async function getPatientVitals(patientNumber: string) {
  try {
    const vitals = await query(
      `SELECT 
        VIT_ID, VIT_BODYTEMP, VIT_HEARTPULSE, VIT_RESPIRATION, VIT_WEIGHT,
        VIT_BLOOD_PRESSURE, VIT_OXYGEN_SAT, VIT_RECORDED_BY, VIT_RECORDED_DATE
       FROM V_VITALS 
       WHERE VIT_PAT_NUMBER = :1
       ORDER BY VIT_RECORDED_DATE DESC`,
      [patientNumber]
    );
    return vitals || [];
  } catch (error) {
    console.error('Error fetching vitals:', error);
    return [];
  }
}

export default async function PatientVitals() {
  const session = await getSession();
  
  if (!session || session.role !== 'patient' || !session.patientNumber) {
    redirect('/login');
  }

  const vitals = await getPatientVitals(session.patientNumber);

  return <VitalsClient vitals={vitals} />;
}
