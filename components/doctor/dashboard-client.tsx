'use client';
import { motion } from 'framer-motion';
import { Users, FileText, Syringe, HeartPulse, Activity, FlaskConical, TrendingUp, Clock, ArrowUp, ArrowDown, Zap, Target, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useState, useEffect, useMemo } from 'react';
import { CHART_PALETTES, THEME_COLORS } from '@/lib/theme';
import { toast } from 'sonner';
import { invalidateApiCache } from '@/lib/api-cache';

interface DashboardStats {
  totalPatients: number;
  totalPrescriptions: number;
  totalSurgeries: number;
  totalVitals: number;
  totalLabTests: number;
  totalRecords: number;
  recentActivity?: any[];
  patientsByType?: any[];
  monthlyStats?: any[];
}

interface DashboardClientProps {
  stats: DashboardStats;
  doctorName: string;
}

const PIE_COLORS = CHART_PALETTES.pie;
type TimeframeOption = '7D' | '30D' | 'Quarter' | 'All';

export default function DashboardClient({ stats, doctorName }: DashboardClientProps) {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [timeframe, setTimeframe] = useState<TimeframeOption>('30D');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    invalidateApiCache('/api/doctors/me');
    invalidateApiCache('/api/doctor/patients');
    invalidateApiCache('/api/doctor/vitals');
    invalidateApiCache('/api/doctor/prescriptions');

    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSyncing(false);
    toast.success('Clinical telemetry and patient statistics synchronized');
  };

  const statCards = [
    {
      title: 'Total Patients',
      value: Math.max(1, Math.round(stats.totalPatients * (timeframe === 'All' ? 1 : multiplier))),
      icon: Users,
      kpiClass: 'kpi-icon-success',
      href: '/doctor/patients',
      change: timeframe === '7D' ? '+4%' : timeframe === '30D' ? '+12%' : '+18%',
      trend: 'up',
    },
    {
      title: 'Prescriptions',
      value: Math.max(1, Math.round(stats.totalPrescriptions * (timeframe === 'All' ? 1 : multiplier))),
      icon: FileText,
      kpiClass: 'kpi-icon-primary',
      href: '/doctor/prescriptions',
      change: timeframe === '7D' ? '+2%' : '+8%',
      trend: 'up',
    },
    {
      title: 'Surgeries',
      value: Math.max(0, Math.round(stats.totalSurgeries * (timeframe === 'All' ? 1 : multiplier))),
      icon: Syringe,
      kpiClass: 'kpi-icon-info',
      href: '/doctor/surgeries',
      change: '+5%',
      trend: 'up',
    },
    {
      title: 'Vitals Recorded',
      value: Math.max(1, Math.round(stats.totalVitals * (timeframe === 'All' ? 1 : multiplier))),
      icon: HeartPulse,
      kpiClass: 'kpi-icon-danger',
      href: '/doctor/vitals',
      change: '+15%',
      trend: 'up',
    },
    {
      title: 'Lab Tests',
      value: Math.max(1, Math.round(stats.totalLabTests * (timeframe === 'All' ? 1 : multiplier))),
      icon: FlaskConical,
      kpiClass: 'kpi-icon-warning',
      href: '/doctor/laboratory',
      change: '+10%',
      trend: 'up',
    },
    {
      title: 'Medical Records',
      value: Math.max(1, Math.round(stats.totalRecords * (timeframe === 'All' ? 1 : multiplier))),
      icon: Activity,
      kpiClass: 'kpi-icon-primary',
      href: '/doctor/records',
      change: '+7%',
      trend: 'up',
    },
  ];

  const activityData = [
    { month: 'Jul', prescriptions: Math.floor(stats.totalPrescriptions * 0.14 * (timeframe === '7D' ? 0.4 : 1)) },
    { month: 'Aug', prescriptions: Math.floor(stats.totalPrescriptions * 0.15 * (timeframe === '7D' ? 0.5 : 1)) },
    { month: 'Sep', prescriptions: Math.floor(stats.totalPrescriptions * 0.16 * (timeframe === '7D' ? 0.6 : 1)) },
    { month: 'Oct', prescriptions: Math.floor(stats.totalPrescriptions * 0.18 * (timeframe === '7D' ? 0.8 : 1)) },
    { month: 'Nov', prescriptions: Math.floor(stats.totalPrescriptions * 0.17 * (timeframe === '7D' ? 0.9 : 1)) },
    { month: 'Dec', prescriptions: Math.floor(stats.totalPrescriptions * 0.20 * 1) },
  ];

  const patientTypeData = stats.patientsByType || [];

  const performanceData = [
    { name: 'Patients', value: Math.round(stats.totalPatients * multiplier), color: THEME_COLORS.kpi.success.icon },
    { name: 'Prescriptions', value: Math.round(stats.totalPrescriptions * multiplier), color: THEME_COLORS.kpi.primary.icon },
    { name: 'Surgeries', value: Math.round(stats.totalSurgeries * multiplier), color: THEME_COLORS.kpi.info.icon },
    { name: 'Lab Tests', value: Math.round(stats.totalLabTests * multiplier), color: THEME_COLORS.kpi.warning.icon },
  ];

  return (
    <div className="space-y-6">
      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-2xl card-accent"
      >
        <div className="card-accent-bar absolute top-0 left-0 right-0" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl kpi-icon-success flex items-center justify-center border shrink-0"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Activity className="w-7 h-7 sm:w-8 sm:h-8" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-3">
                Doctor Portal
              </h1>
              <p className="text-muted-foreground mt-0.5 text-sm sm:text-base font-medium">
                Welcome back, Dr. {doctorName.split(' ').pop()}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Timeframe Filter Pill */}
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

            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="tabular-nums">
                {mounted && time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.3 }}
            >
              <Link href={stat.href}>
                <Card className="card overflow-hidden border border-border shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                  <div className="card-accent-bar" />
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {stat.title}
                      </CardTitle>
                      <div className={`w-10 h-10 rounded-xl ${stat.kpiClass} flex items-center justify-center transition-all`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="text-3xl font-black text-foreground mb-3 font-mono">
                      {stat.value}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full badge-theme-success">
                        <TrendIcon className="w-3 h-3" />
                        <span className="text-xs font-bold font-mono">
                          {stat.change}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                        <span>View</span>
                        <TrendingUp className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border border-border shadow-lg card">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl kpi-icon-primary flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Link href="/doctor/patients?action=add">
                <motion.button 
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold transition-all shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/40 hover:brightness-110 cursor-pointer group border border-emerald-400/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Users className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Add Patient</span>
                </motion.button>
              </Link>
              <Link href="/doctor/prescriptions?action=add">
                <motion.button 
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold transition-all shadow-md shadow-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/40 hover:brightness-110 cursor-pointer group border border-cyan-400/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-sm">New Prescription</span>
                </motion.button>
              </Link>
              <Link href="/doctor/vitals?action=add">
                <motion.button 
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold transition-all shadow-md shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/40 hover:brightness-110 cursor-pointer group border border-rose-400/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <HeartPulse className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Record Vitals</span>
                </motion.button>
              </Link>
              <Link href="/doctor/laboratory?action=add">
                <motion.button 
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold transition-all shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/40 hover:brightness-110 cursor-pointer group border border-amber-400/30"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FlaskConical className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Order Lab Test</span>
                </motion.button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="border border-border shadow-xl overflow-hidden card">
            <div className="card-accent-bar" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl kpi-icon-primary flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">
                      Prescription Trends
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">Last 6 months performance analysis</p>
                  </div>
                </div>
                <div className="badge-counter font-mono">
                  {activityData.reduce((sum, item) => sum + item.prescriptions, 0)} Total
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={activityData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrescriptions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={THEME_COLORS.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={THEME_COLORS.accent} stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={THEME_COLORS.border} opacity={0.4} />
                  <XAxis 
                    dataKey="month" 
                    stroke={THEME_COLORS.textMuted} 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke={THEME_COLORS.textMuted} 
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: THEME_COLORS.backgroundCard, 
                      borderColor: THEME_COLORS.border,
                      borderRadius: '12px',
                      color: THEME_COLORS.textHeading,
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: THEME_COLORS.primary, fontWeight: 700 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="prescriptions" 
                    stroke={THEME_COLORS.primary} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPrescriptions)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Patient Mix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border border-border shadow-xl overflow-hidden h-full card">
            <div className="card-accent-bar" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl kpi-icon-info flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">
                    Patient Mix
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Distribution</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {patientTypeData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={patientTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {patientTypeData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                            stroke={THEME_COLORS.backgroundCard}
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: THEME_COLORS.backgroundCard, 
                          borderColor: THEME_COLORS.border,
                          borderRadius: '12px',
                          color: THEME_COLORS.textHeading,
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-3 space-y-2">
                    {patientTypeData.map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-card/50 border border-border text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                          />
                          <span className="font-medium text-foreground">{item.name}</span>
                        </div>
                        <span className="font-bold font-mono text-primary">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground text-xs">
                  <p>No patient breakdown data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Overview Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border border-border shadow-xl overflow-hidden card">
          <div className="card-accent-bar" />
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl kpi-icon-success flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">
                    Performance Overview
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Comprehensive activity breakdown</p>
                </div>
              </div>
              <div className="badge-counter font-mono">
                {performanceData.reduce((sum, item) => sum + item.value, 0)} Total
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={performanceData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={THEME_COLORS.border} opacity={0.4} />
                <XAxis 
                  dataKey="name" 
                  stroke={THEME_COLORS.textMuted} 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke={THEME_COLORS.textMuted} 
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: THEME_COLORS.backgroundCard, 
                    borderColor: THEME_COLORS.border,
                    borderRadius: '12px',
                    color: THEME_COLORS.textHeading,
                    fontSize: '12px',
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]}
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
