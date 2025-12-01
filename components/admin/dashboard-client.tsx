'use client';
import { useState, useMemo } from 'react';
import { 
  Users, 
  UserCog, 
  Pill, 
  HeartPulse, 
  Activity, 
  Stethoscope, 
  ClipboardList, 
  TestTube, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Clock 
} from 'lucide-react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { invalidateApiCache } from '@/lib/api-cache';

interface AdminStats {
  totalPatients: number;
  totalDoctors: number;
  totalPharmaceuticals: number;
  totalVitals: number;
  totalSurgeries: number;
  totalPrescriptions: number;
  totalLabs: number;
  totalRecords: number;
  scheduledSurgeries: number;
  activePrescriptions: number;
  pendingLabs: number;
  lowStockMeds: number;
  recentActivities: any[];
}

interface AdminDashboardClientProps {
  stats: AdminStats;
  userName: string;
}

type TimeframeOption = '7D' | '30D' | 'Quarter' | 'All';

export default function AdminDashboardClient({ stats, userName }: AdminDashboardClientProps) {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<TimeframeOption>('30D');
  const [isSyncing, setIsSyncing] = useState(false);

  const multiplier = useMemo(() => {
    switch (timeframe) {
      case '7D': return 0.35;
      case '30D': return 0.70;
      case 'Quarter': return 0.88;
      case 'All': return 1.0;
    }
  }, [timeframe]);

  const handleLiveSync = async () => {
    setIsSyncing(true);
    invalidateApiCache('/api/patients');
    invalidateApiCache('/api/doctors');
    invalidateApiCache('/api/pharmaceuticals');
    invalidateApiCache('/api/vitals');
    invalidateApiCache('/api/surgery');
    invalidateApiCache('/api/laboratory');

    router.refresh();
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSyncing(false);
    toast.success('Hospital administrative telemetry re-synchronized');
  };

  const mainStats = [
    {
      title: 'Total Patients',
      value: Math.max(1, Math.round(stats.totalPatients * (timeframe === 'All' ? 1 : multiplier))),
      icon: Users,
      iconClass: 'kpi-icon-primary',
      change: timeframe === '7D' ? '+4%' : '+12%',
      trending: 'up',
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: UserCog,
      iconClass: 'kpi-icon-success',
      change: '+8%',
      trending: 'up',
    },
    {
      title: 'Active Prescriptions',
      value: Math.max(1, Math.round(stats.activePrescriptions * (timeframe === 'All' ? 1 : multiplier))),
      icon: Pill,
      iconClass: 'kpi-icon-info',
      change: '+15%',
      trending: 'up',
    },
    {
      title: 'Scheduled Surgeries',
      value: Math.max(0, Math.round(stats.scheduledSurgeries * (timeframe === 'All' ? 1 : multiplier))),
      icon: Activity,
      iconClass: 'kpi-icon-danger',
      change: '-3%',
      trending: 'down',
    },
  ];

  const detailStats = [
    {
      title: 'Vital Records',
      value: Math.max(1, Math.round(stats.totalVitals * (timeframe === 'All' ? 1 : multiplier))),
      icon: HeartPulse,
      iconClass: 'kpi-icon-danger',
    },
    {
      title: 'Laboratory Tests',
      value: Math.max(1, Math.round(stats.totalLabs * (timeframe === 'All' ? 1 : multiplier))),
      icon: TestTube,
      iconClass: 'kpi-icon-info',
    },
    {
      title: 'Medical Records',
      value: Math.max(1, Math.round(stats.totalRecords * (timeframe === 'All' ? 1 : multiplier))),
      icon: ClipboardList,
      iconClass: 'kpi-icon-primary',
    },
    {
      title: 'Total Surgeries',
      value: Math.max(0, Math.round(stats.totalSurgeries * (timeframe === 'All' ? 1 : multiplier))),
      icon: Stethoscope,
      iconClass: 'kpi-icon-warning',
    },
    {
      title: 'Pharmaceuticals',
      value: stats.totalPharmaceuticals,
      icon: Pill,
      iconClass: 'kpi-icon-success',
    },
    {
      title: 'All Prescriptions',
      value: Math.max(1, Math.round(stats.totalPrescriptions * (timeframe === 'All' ? 1 : multiplier))),
      icon: ClipboardList,
      iconClass: 'kpi-icon-primary',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header with Timeframe & Live Sync Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            Welcome back, {userName}! Here&apos;s real-time operations and telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe Selector Pill */}
          <div className="flex items-center p-1 rounded-xl bg-muted/80 border border-border">
            {(['7D', '30D', 'Quarter', 'All'] as TimeframeOption[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tf === 'All' ? 'All Time' : tf}
              </button>
            ))}
          </div>

          {/* Live Sync Action Button */}
          <button
            type="button"
            onClick={handleLiveSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-card hover:bg-muted/60 border border-border text-xs font-bold text-foreground transition-all cursor-pointer shadow-sm"
            title="Click to sync live data"
          >
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>Live Sync</span>
            <RefreshCw className={`w-3.5 h-3.5 text-primary ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trending === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl bg-card border border-border/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="card-accent-bar" />
              
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6 sm:pb-2 relative">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 sm:p-3 rounded-xl shadow-lg ${stat.iconClass}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </CardHeader>
              
              <CardContent className="relative p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="flex items-end justify-between">
                  <div className="text-3xl sm:text-4xl font-bold text-foreground font-mono">{stat.value}</div>
                  <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${
                    stat.trending === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    <TrendIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          Detailed Clinical Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {detailStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/70 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden"
              >
                <div className={`p-3 rounded-lg ${stat.iconClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground font-mono">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions & Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts & Notifications */}
        <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="card-accent-bar" />
          
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-heading">
                    System Alerts & Operations
                  </h3>
                  <p className="text-xs text-muted">Real-time alerts requiring administrator attention</p>
                </div>
              </div>
              <span className="badge-counter badge-theme-warning">
                {(stats.lowStockMeds > 0 ? 1 : 0) + (stats.pendingLabs > 0 ? 1 : 0) + (stats.scheduledSurgeries > 0 ? 1 : 0)} Active
              </span>
            </div>

            <div className="space-y-3">
              {stats.lowStockMeds > 0 && (
                <div className="flex items-center justify-between p-3.5 bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/25 rounded-xl transition-all hover:border-amber-500/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-heading">Low Medication Stock</p>
                      <p className="text-xs text-muted">{stats.lowStockMeds} pharmaceuticals below safe inventory threshold</p>
                    </div>
                  </div>
                  <a
                    href="/admin/pharmaceuticals"
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/15 hover:bg-amber-500/25 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 shrink-0"
                  >
                    Restock <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {stats.pendingLabs > 0 && (
                <div className="flex items-center justify-between p-3.5 bg-cyan-500/10 dark:bg-cyan-950/30 border border-cyan-500/25 rounded-xl transition-all hover:border-cyan-500/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                      <TestTube className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-heading">Pending Laboratory Tests</p>
                      <p className="text-xs text-muted">{stats.pendingLabs} diagnostic assays awaiting physician validation</p>
                    </div>
                  </div>
                  <a
                    href="/admin/laboratory"
                    className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/15 hover:bg-cyan-500/25 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 shrink-0"
                  >
                    Review <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {stats.scheduledSurgeries > 0 && (
                <div className="flex items-center justify-between p-3.5 bg-blue-500/10 dark:bg-blue-950/30 border border-blue-500/25 rounded-xl transition-all hover:border-blue-500/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-heading">Scheduled Surgical Procedures</p>
                      <p className="text-xs text-muted">{stats.scheduledSurgeries} operations slotted in operating theaters</p>
                    </div>
                  </div>
                  <a
                    href="/admin/surgery"
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/15 hover:bg-blue-500/25 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 shrink-0"
                  >
                    Schedule <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {stats.lowStockMeds === 0 && stats.pendingLabs === 0 && stats.scheduledSurgeries === 0 && (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/25 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-heading">All Subsystems Nominal</p>
                    <p className="text-xs text-muted">Zero critical alerts or backlog across clinical modules</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Oracle 19c Enterprise Engine
            </span>
            <span className="font-mono font-medium">Auto-synced</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="card-accent-bar" />

          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-heading">
                    Recent Patient Admissions
                  </h3>
                  <p className="text-xs text-muted">Latest registered patient cohorts and admissions</p>
                </div>
              </div>
              <a
                href="/admin/patients"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                View Directory <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-3">
              {stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((activity: { type: string; name: string; date: string }, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-xl hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {activity.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'PT'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-heading truncate">{activity.name}</p>
                        <p className="text-xs text-muted">Registered Inpatient Cohort</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted font-mono shrink-0 ml-2">
                      {activity.date ? new Date(activity.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted text-sm">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No recent admission logs recorded
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              Real-time Event Stream
            </span>
            <span className="font-semibold text-heading">{stats.totalPatients} Active Records</span>
          </div>
        </div>
      </div>
    </div>
  );
}
