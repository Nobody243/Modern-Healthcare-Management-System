export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import ProfileClient from '@/components/patient/profile-client';

async function getPatientProfile(patientNumber: string) {
  try {
    const patient = await query(
      `SELECT 
        PAT_ID, PAT_FNAME, PAT_LNAME, PAT_EMAIL, PAT_NUMBER, PAT_PHONE, 
        PAT_ADDR, PAT_DOB, PAT_AGE, PAT_GENDER, PAT_BLOOD_GROUP, PAT_TYPE,
        PAT_ASSIGNED_DOC, PAT_EMERGENCY_CONTACT, PAT_DATE_JOINED
       FROM HIS_PATIENTS 
       WHERE PAT_NUMBER = :1`,
      [patientNumber]
    );

    if (patient && patient.length > 0) {
      return {
        ...patient[0],
        hasPassword: false
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    return null;
  }
}

export default async function PatientProfile() {
  const session = await getSession();
  
  if (!session || session.role !== 'patient' || !session.patientNumber) {
    redirect('/login');
  }

  const profile = await getPatientProfile(session.patientNumber);

  if (!profile) {
    redirect('/patient/dashboard');
  }

  return <ProfileClient profile={profile} />;
}
