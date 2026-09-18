export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCog, Pill, HeartPulse, Activity, Stethoscope, ClipboardList, TestTube, ArrowUpRight, ArrowDownRight, TrendingUp, Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

  const mainStats = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'from-sky-500 to-cyan-500',
      bgColor: 'bg-sky-50 dark:bg-sky-950/20',
      iconBg: 'bg-sky-500',
      change: '+12%',
      trending: 'up',
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: UserCog,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      iconBg: 'bg-emerald-500',
      change: '+8%',
      trending: 'up',
    },
    {
      title: 'Active Prescriptions',
      value: stats.activePrescriptions,
      icon: Pill,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      iconBg: 'bg-purple-500',
      change: '+15%',
      trending: 'up',
    },
    {
      title: 'Scheduled Surgeries',
      value: stats.scheduledSurgeries,
      icon: Activity,
      color: 'from-rose-500 to-red-500',
      bgColor: 'bg-rose-50 dark:bg-rose-950/20',
      iconBg: 'bg-rose-500',
      change: '-3%',
      trending: 'down',
    },
  ];

  const detailStats = [
    {
      title: 'Vital Records',
      value: stats.totalVitals,
      icon: HeartPulse,
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
    {
      title: 'Laboratory Tests',
      value: stats.totalLabs,
      icon: TestTube,
      iconColor: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      title: 'Medical Records',
      value: stats.totalRecords,
      icon: ClipboardList,
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Total Surgeries',
      value: stats.totalSurgeries,
      icon: Stethoscope,
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Pharmaceuticals',
      value: stats.totalPharmaceuticals,
      icon: Pill,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'All Prescriptions',
      value: stats.totalPrescriptions,
      icon: ClipboardList,
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Welcome back, {session.name}! Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg">
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold">Live Stats</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trending === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}></div>
              
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.iconBg} p-3 rounded-xl shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              
              <CardContent className="relative">
                <div className="flex items-end justify-between">
                  <div className="text-4xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trending === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </div>
          );
        })}
      </div>

      {/* Detail Stats Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          Detailed Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {detailStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50">
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions & Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts & Notifications */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Alerts & Notifications
          </h3>
          <div className="space-y-3">
            {stats.lowStockMeds > 0 && (
              <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">Low Stock Alert</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">{stats.lowStockMeds} medications are running low</p>
                </div>
                <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700">
                  {stats.lowStockMeds}
                </Badge>
              </div>
            )}
            {stats.pendingLabs > 0 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <TestTube className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Pending Lab Tests</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">{stats.pendingLabs} tests awaiting results</p>
                </div>
                <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                  {stats.pendingLabs}
                </Badge>
              </div>
            )}
            {stats.scheduledSurgeries > 0 && (
              <div className="flex items-start gap-3 p-3 bg-sky-50 dark:bg-sky-950/20 rounded-lg border border-sky-200 dark:border-sky-800">
                <Calendar className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-sky-900 dark:text-sky-100">Upcoming Surgeries</p>
                  <p className="text-xs text-sky-700 dark:text-sky-300">{stats.scheduledSurgeries} surgeries scheduled</p>
                </div>
                <Badge variant="outline" className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-700">
                  {stats.scheduledSurgeries}
                </Badge>
              </div>
            )}
            {stats.lowStockMeds === 0 && stats.pendingLabs === 0 && stats.scheduledSurgeries === 0 && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">All systems operational - No alerts</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity: { type: string; name: string; date: string }, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30">
                    <Users className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{activity.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">New {activity.type.toLowerCase()} registered</p>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
