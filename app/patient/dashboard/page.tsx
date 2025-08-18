import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import PatientDashboardClient from '@/components/patient/dashboard-client';

async function getPatientStats(patientNumber: string) {
  try {
    const [prescriptions, labs, vitals, surgeries, records] = await Promise.all([
      query('SELECT COUNT(*) as count FROM HIS_PRESCRIPTIONS WHERE PRES_PAT_NUMBER = :1', [patientNumber]).catch(() => [{ count: 0 }]),
      query('SELECT COUNT(*) as count FROM HIS_LABORATORY WHERE LAB_PAT_NUMBER = :1', [patientNumber]).catch(() => [{ count: 0 }]),
      query('SELECT COUNT(*) as count FROM HIS_VITALS WHERE VIT_PAT_NUMBER = :1', [patientNumber]).catch(() => [{ count: 0 }]),
      query('SELECT COUNT(*) as count FROM HIS_SURGERY WHERE SURG_PAT_NUMBER = :1', [patientNumber]).catch(() => [{ count: 0 }]),
      query('SELECT COUNT(*) as count FROM HIS_MEDICAL_RECORDS WHERE MDR_PAT_NUMBER = :1', [patientNumber]).catch(() => [{ count: 0 }]),
    ]);

    return {
      totalPrescriptions: Number(prescriptions[0]?.COUNT || prescriptions[0]?.count || 0),
      totalLabs: Number(labs[0]?.COUNT || labs[0]?.count || 0),
      totalVitals: Number(vitals[0]?.COUNT || vitals[0]?.count || 0),
      totalSurgeries: Number(surgeries[0]?.COUNT || surgeries[0]?.count || 0),
      totalRecords: Number(records[0]?.COUNT || records[0]?.count || 0),
    };
  } catch (error) {
    console.error('Error fetching patient stats:', error);
    return {
      totalPrescriptions: 0,
      totalLabs: 0,
      totalVitals: 0,
      totalSurgeries: 0,
      totalRecords: 0,
    };
  }
}

async function getPatientInfo(patientNumber: string) {
  try {
    const patient = await query(
      `SELECT 
        p.PAT_FNAME, p.PAT_LNAME, p.PAT_AGE, p.PAT_BLOOD_GROUP, p.PAT_TYPE, 
        p.PAT_DATE_JOINED, p.PAT_GENDER, p.PAT_PHONE, p.PAT_ADDR,
        (d.DOC_FNAME || ' ' || d.DOC_LNAME) AS PAT_ASSIGNED_DOC
       FROM HIS_PATIENTS p
       LEFT JOIN HIS_DOCS d ON p.PAT_ASSIGNED_DOC = d.DOC_NUMBER
       WHERE p.PAT_NUMBER = :1`,
      [patientNumber]
    );

    if (patient && patient.length > 0) {
      return patient[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching patient info:', error);
    return null;
  }
}

export default async function PatientDashboard() {
  const session = await getSession();
  
  if (!session || session.role !== 'patient' || !session.patientNumber) {
    redirect('/login');
  }

  const [stats, patientInfo] = await Promise.all([
    getPatientStats(session.patientNumber),
    getPatientInfo(session.patientNumber),
  ]);

  return (
    <PatientDashboardClient 
      stats={stats} 
      patientInfo={patientInfo} 
      patientNumber={session.patientNumber}
    />
  );
}
