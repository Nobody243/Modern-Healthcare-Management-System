'use client';
import { motion } from 'framer-motion';
import { FileText, Activity, HeartPulse, FlaskConical, Scissors, Calendar, User, Droplets, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PatientStats {
  totalPrescriptions: number;
  totalLabs: number;
  totalVitals: number;
  totalSurgeries: number;
  totalRecords: number;
}

interface PatientInfo {
  PAT_FNAME: string;
  PAT_LNAME: string;
  PAT_AGE?: number;
  PAT_BLOOD_GROUP?: string;
  PAT_TYPE?: string;
  PAT_ASSIGNED_DOC?: string;
  PAT_DATE_JOINED?: string;
  PAT_GENDER?: string;
  PAT_PHONE?: string;
  PAT_ADDR?: string;
}

interface DashboardClientProps {
  stats: PatientStats;
  patientInfo: PatientInfo | null;
  patientNumber: string;
}

export default function PatientDashboardClient({ stats, patientInfo, patientNumber }: DashboardClientProps) {
  const statCards = [
    {
      title: 'My Prescriptions',
      value: stats.totalPrescriptions,
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      href: '/patient/prescriptions',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    },
    {
      title: 'Lab Results',
      value: stats.totalLabs,
      icon: FlaskConical,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
      href: '/patient/laboratory',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
    },
    {
      title: 'Vital Records',
      value: stats.totalVitals,
      icon: HeartPulse,
      gradient: 'from-rose-500 to-pink-500',
      bgGradient: 'from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20',
      borderColor: 'border-rose-200 dark:border-rose-800',
      href: '/patient/vitals',
      iconBg: 'bg-gradient-to-br from-rose-500 to-pink-500',
    },
    {
      title: 'Surgeries',
      value: stats.totalSurgeries,
      icon: Scissors,
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      href: '/patient/surgeries',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-500',
    },
    {
      title: 'Medical Records',
      value: stats.totalRecords,
      icon: Activity,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      href: '/patient/records',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 border-2 border-cyan-200 dark:border-cyan-800 shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500" />
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Welcome back, {patientInfo?.PAT_FNAME || 'Patient'}! 👋
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Here&apos;s your health information overview
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {patientInfo?.PAT_AGE && (
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">Age</p>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">{patientInfo.PAT_AGE} years</p>
                </div>
              )}
              {patientInfo?.PAT_BLOOD_GROUP && (
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-rose-200 dark:border-rose-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Droplets className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <p className="text-rose-600 dark:text-rose-400 text-sm font-medium">Blood Group</p>
                  </div>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">{patientInfo.PAT_BLOOD_GROUP}</p>
                </div>
              )}
              {patientInfo?.PAT_TYPE && (
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <p className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-1">Patient Type</p>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">{patientInfo.PAT_TYPE}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
            >
              <Link href={card.href}>
                <Card className={`relative overflow-hidden border-2 ${card.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-full bg-gradient-to-br ${card.bgGradient}`}>
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {card.title}
                      </CardTitle>
                      <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                      {card.value}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total {card.title.toLowerCase()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Health Summary - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">Health Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Patient Type</p>
                <p className="font-bold text-lg text-gray-900 dark:text-white">
                  {patientInfo?.PAT_TYPE || 'Not specified'}
                </p>
              </div>
              {patientInfo?.PAT_ASSIGNED_DOC && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Assigned Doctor</p>
                  </div>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    Dr. {patientInfo.PAT_ASSIGNED_DOC}
                  </p>
                </div>
              )}
              {patientInfo?.PAT_DATE_JOINED && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                  </div>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    {new Date(patientInfo.PAT_DATE_JOINED).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
