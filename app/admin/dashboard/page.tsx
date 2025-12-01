export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import AdminDashboardClient from '@/components/admin/dashboard-client';

async function getDashboardStats() {
  try {
    const [patients, doctors, pharmaceuticals, vitals, surgeries, prescriptions, labs, records] = await Promise.all([
      query('SELECT COUNT(*) as "count" FROM HIS_PATIENTS'),
      query('SELECT COUNT(*) as "count" FROM HIS_DOCS'),
      query('SELECT COUNT(*) as "count" FROM HIS_PHARMACEUTICALS'),
      query('SELECT COUNT(*) as "count" FROM HIS_VITALS'),
      query('SELECT COUNT(*) as "count" FROM HIS_SURGERY'),
      query('SELECT COUNT(*) as "count" FROM HIS_PRESCRIPTIONS'),
      query('SELECT COUNT(*) as "count" FROM HIS_LABORATORY'),
      query('SELECT COUNT(*) as "count" FROM HIS_MEDICAL_RECORDS'),
    ]);

    // Get recent activity counts
    const scheduledSurgeries = await query(`SELECT COUNT(*) as "count" FROM HIS_SURGERY WHERE SURG_STATUS = 'Scheduled'`);
    const activePrescriptions = await query(`SELECT COUNT(*) as "count" FROM HIS_PRESCRIPTIONS WHERE PRES_STATUS = 'Active'`);
    const pendingLabs = await query(`SELECT COUNT(*) as "count" FROM HIS_LABORATORY WHERE LAB_STATUS = 'Pending'`);
    const lowStockMeds = await query(`SELECT COUNT(*) as "count" FROM HIS_PHARMACEUTICALS WHERE PHAR_QTY < 50`);

    // Get recent records for activity feed (using PAT_ID instead of CREATED_AT)
    const recentActivities = await query(`
      SELECT * FROM (
        SELECT 
          'Patient' as "type",
          PAT_FNAME || ' ' || PAT_LNAME as "name",
          TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') as "date"
        FROM HIS_PATIENTS 
        ORDER BY PAT_ID DESC
      )
      WHERE ROWNUM <= 5
    `);

    return {
      totalPatients: patients[0]?.count || 0,
      totalDoctors: doctors[0]?.count || 0,
      totalPharmaceuticals: pharmaceuticals[0]?.count || 0,
      totalVitals: vitals[0]?.count || 0,
      totalSurgeries: surgeries[0]?.count || 0,
      totalPrescriptions: prescriptions[0]?.count || 0,
      totalLabs: labs[0]?.count || 0,
      totalRecords: records[0]?.count || 0,
      scheduledSurgeries: scheduledSurgeries[0]?.count || 0,
      activePrescriptions: activePrescriptions[0]?.count || 0,
      pendingLabs: pendingLabs[0]?.count || 0,
      lowStockMeds: lowStockMeds[0]?.count || 0,
      recentActivities: recentActivities || [],
    };
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return {
      totalPatients: 0,
      totalDoctors: 0,
      totalPharmaceuticals: 0,
      totalVitals: 0,
      totalSurgeries: 0,
      totalPrescriptions: 0,
      totalLabs: 0,
      totalRecords: 0,
      scheduledSurgeries: 0,
      activePrescriptions: 0,
      pendingLabs: 0,
      lowStockMeds: 0,
      recentActivities: [],
    };
  }
}

export default async function AdminDashboard() {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const stats = await getDashboardStats();

  return <AdminDashboardClient stats={stats} userName={session.name} />;
}

