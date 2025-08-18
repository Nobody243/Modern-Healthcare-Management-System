import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import DashboardClient from '@/components/doctor/dashboard-client';

async function getDoctorStats(doctorNumber: string) {
  try {
    const [patients, prescriptions, surgeries, vitals, labTests, records, recentActivity, patientsByType, monthlyStats] = await Promise.all([
      query('SELECT COUNT(*) as count FROM HIS_PATIENTS WHERE PAT_ASSIGNED_DOC = :1', [doctorNumber]).catch(() => [{ count: 0 }]),
      query('SELECT COUNT(*) as count FROM HIS_PRESCRIPTIONS WHERE PRES_DOC_NUMBER = :1', [doctorNumber]).catch(() => [{ count: 0 }]),
      query('SELECT COUNT(*) as count FROM HIS_SURGERY WHERE SURG_DOC_NUMBER = :1', [doctorNumber]).catch(() => [{ count: 0 }]),
      query('SELECT COUNT(*) as count FROM HIS_VITALS WHERE VIT_PAT_NUMBER IN (SELECT PAT_NUMBER FROM HIS_PATIENTS WHERE PAT_ASSIGNED_DOC = :1)', [doctorNumber]).catch(() => [{ count: 0 }]),
      query('SELECT COUNT(*) as count FROM HIS_LABORATORY WHERE LAB_DOC_NUMBER = :1', [doctorNumber]).catch(() => [{ count: 0 }]),
      query('SELECT COUNT(*) as count FROM HIS_MEDICAL_RECORDS WHERE MDR_DOC_NUMBER = :1', [doctorNumber]).catch(() => [{ count: 0 }]),
      
      // Recent activity - using ROWNUM for Oracle
      query('SELECT * FROM (SELECT PRES_PAT_NAME as patient, PRES_DATE as prescdate, PRES_MEDICATION as details FROM V_PRESCRIPTIONS WHERE PRES_DOC_NUMBER = :1 ORDER BY PRES_DATE DESC) WHERE ROWNUM <= 5', [doctorNumber]).catch(() => []),
      
      // Patients by type
      query('SELECT PAT_TYPE, COUNT(PAT_NUMBER) as total FROM HIS_PATIENTS WHERE PAT_ASSIGNED_DOC = :1 GROUP BY PAT_TYPE', [doctorNumber]).catch(() => []),
      
      // Monthly stats - simplified without date functions that might cause issues
      query('SELECT PRES_NUMBER FROM HIS_PRESCRIPTIONS WHERE PRES_DOC_NUMBER = :1', [doctorNumber]).catch(() => []),
    ]);

    return {
      totalPatients: Number(patients[0]?.COUNT || patients[0]?.count || 0),
      totalPrescriptions: Number(prescriptions[0]?.COUNT || prescriptions[0]?.count || 0),
      totalSurgeries: Number(surgeries[0]?.COUNT || surgeries[0]?.count || 0),
      totalVitals: Number(vitals[0]?.COUNT || vitals[0]?.count || 0),
      totalLabTests: Number(labTests[0]?.COUNT || labTests[0]?.count || 0),
      totalRecords: Number(records[0]?.COUNT || records[0]?.count || 0),
      recentActivity: recentActivity || [],
      patientsByType: (patientsByType || []).map((p: any) => ({
        name: p.PAT_TYPE || 'Unknown',
        value: Number(p.TOTAL || p.total || 0)
      })),
      monthlyStats: [],
    };
  } catch (error) {
    console.error('Error fetching doctor stats:', error);
    return {
      totalPatients: 0,
      totalPrescriptions: 0,
      totalSurgeries: 0,
      totalVitals: 0,
      totalLabTests: 0,
      totalRecords: 0,
      recentActivity: [],
      patientsByType: [],
      monthlyStats: [],
    };
  }
}

export default async function DoctorDashboard() {
  const session = await getSession();
  
  if (!session || session.role !== 'doctor' || !session.doctorNumber) {
    redirect('/login');
  }

  const stats = await getDoctorStats(session.doctorNumber);

  return <DashboardClient stats={stats} doctorName={session.name} />;
}
