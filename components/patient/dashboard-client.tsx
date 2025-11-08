'use client';
import { motion } from 'framer-motion';
import { FileText, Activity, HeartPulse, FlaskConical, Scissors, Calendar, User, Droplets } from 'lucide-react';
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
      iconClass: 'kpi-icon-primary',
      href: '/patient/prescriptions',
    },
    {
      title: 'Lab Results',
      value: stats.totalLabs,
      icon: FlaskConical,
      iconClass: 'kpi-icon-warning',
      href: '/patient/laboratory',
    },
    {
      title: 'Vital Records',
      value: stats.totalVitals,
      icon: HeartPulse,
      iconClass: 'kpi-icon-danger',
      href: '/patient/vitals',
    },
    {
      title: 'Surgeries',
      value: stats.totalSurgeries,
      icon: Scissors,
      iconClass: 'kpi-icon-info',
      href: '/patient/surgeries',
    },
    {
      title: 'Medical Records',
      value: stats.totalRecords,
      icon: Activity,
      iconClass: 'kpi-icon-success',
      href: '/patient/records',
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
        <Card className="card overflow-hidden border border-border shadow-lg">
          <div className="card-accent-bar" />
          <CardHeader className="p-4 sm:p-6 pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-heading mb-1">
                  Welcome back, {patientInfo?.PAT_FNAME || 'Patient'}! 👋
                </CardTitle>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Here&apos;s your personal health and clinical records overview
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl kpi-icon-primary flex items-center justify-center shadow-lg shrink-0">
                <User className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {patientInfo?.PAT_AGE && (
                <div className="bg-card rounded-xl p-3 sm:p-4 border border-border">
                  <p className="text-primary text-xs font-medium mb-1">Age</p>
                  <p className="font-bold text-base sm:text-lg text-heading">{patientInfo.PAT_AGE} years</p>
                </div>
              )}
              {patientInfo?.PAT_BLOOD_GROUP && (
                <div className="bg-card rounded-xl p-3 sm:p-4 border border-border">
                  <p className="text-kpi-danger text-xs font-medium mb-1 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5" /> Blood Group
                  </p>
                  <p className="font-bold text-base sm:text-lg text-heading">{patientInfo.PAT_BLOOD_GROUP}</p>
                </div>
              )}
              <div className="bg-card rounded-xl p-3 sm:p-4 border border-border">
                <p className="text-muted-foreground text-xs font-medium mb-1">Patient Identifier</p>
                <p className="font-bold text-base sm:text-lg table-id-link truncate">{patientNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                <Card className="card overflow-hidden border border-border hover:border-primary/50 transition-all shadow-lg cursor-pointer group h-full">
                  <div className="card-accent-bar" />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xs font-bold text-muted uppercase tracking-wider">
                        {card.title}
                      </CardTitle>
                      <div className={`w-12 h-12 rounded-xl ${card.iconClass} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-black text-heading mb-2">
                      {card.value}
                    </div>
                    <p className="text-xs text-muted">
                      Total {card.title.toLowerCase()} recorded
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
        <Card className="card overflow-hidden border border-border shadow-lg">
          <div className="card-accent-bar" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl kpi-icon-info flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-bold text-heading">Health Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-card border border-border">
                <p className="text-sm text-muted mb-2">Patient Type</p>
                <p className="font-bold text-lg text-heading">
                  {patientInfo?.PAT_TYPE || 'Out-Patient'}
                </p>
              </div>
              {patientInfo?.PAT_ASSIGNED_DOC && (
                <div className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-primary" />
                    <p className="text-sm text-muted">Assigned Doctor</p>
                  </div>
                  <p className="font-bold text-lg text-heading">
                    Dr. {patientInfo.PAT_ASSIGNED_DOC}
                  </p>
                </div>
              )}
              {patientInfo?.PAT_DATE_JOINED && (
                <div className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <p className="text-sm text-muted">Member Since</p>
                  </div>
                  <p className="font-bold text-lg text-heading">
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
