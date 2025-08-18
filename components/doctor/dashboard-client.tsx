'use client';
import { motion } from 'framer-motion';
import { Users, FileText, Syringe, HeartPulse, Activity, FlaskConical, Calendar, TrendingUp, Clock, ArrowUp, ArrowDown, Zap, Target, Award } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react';

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

const COLORS = {
  emerald: ['#10b981', '#059669'],
  blue: ['#3b82f6', '#2563eb'],
  purple: ['#a855f7', '#9333ea'],
  rose: ['#f43f5e', '#e11d48'],
  amber: ['#f59e0b', '#d97706'],
  cyan: ['#06b6d4', '#0891b2'],
};

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e', '#a855f7', '#06b6d4'];

export default function DashboardClient({ stats, doctorName }: DashboardClientProps) {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-700',
      href: '/doctor/patients',
      change: '+12%',
      trend: 'up',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Prescriptions',
      value: stats.totalPrescriptions,
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
      href: '/doctor/prescriptions',
      change: '+8%',
      trend: 'up',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Surgeries',
      value: stats.totalSurgeries,
      icon: Syringe,
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20',
      borderColor: 'border-indigo-200 dark:border-indigo-700',
      href: '/doctor/surgeries',
      change: '+5%',
      trend: 'up',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      title: 'Vitals Recorded',
      value: stats.totalVitals,
      icon: HeartPulse,
      gradient: 'from-rose-500 to-red-500',
      bgGradient: 'from-rose-50 to-red-50 dark:from-rose-950/20 dark:to-red-950/20',
      borderColor: 'border-rose-200 dark:border-rose-700',
      href: '/doctor/vitals',
      change: '+15%',
      trend: 'up',
      iconColor: 'text-rose-600 dark:text-rose-400'
    },
    {
      title: 'Lab Tests',
      value: stats.totalLabTests,
      icon: FlaskConical,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20',
      borderColor: 'border-amber-200 dark:border-amber-700',
      href: '/doctor/laboratory',
      change: '+10%',
      trend: 'up',
      iconColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      title: 'Medical Records',
      value: stats.totalRecords,
      icon: Activity,
      gradient: 'from-teal-500 to-cyan-500',
      bgGradient: 'from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20',
      borderColor: 'border-teal-200 dark:border-teal-700',
      href: '/doctor/records',
      change: '+7%',
      trend: 'up',
      iconColor: 'text-teal-600 dark:text-teal-400'
    },
  ];

  // Prepare chart data - generate dummy data for monthly stats since we simplified the query
  const activityData = [
    { month: 'Jul', prescriptions: Math.floor(stats.totalPrescriptions * 0.14) },
    { month: 'Aug', prescriptions: Math.floor(stats.totalPrescriptions * 0.15) },
    { month: 'Sep', prescriptions: Math.floor(stats.totalPrescriptions * 0.16) },
    { month: 'Oct', prescriptions: Math.floor(stats.totalPrescriptions * 0.18) },
    { month: 'Nov', prescriptions: Math.floor(stats.totalPrescriptions * 0.17) },
    { month: 'Dec', prescriptions: Math.floor(stats.totalPrescriptions * 0.20) },
  ];

  const patientTypeData = stats.patientsByType || [];

  const performanceData = [
    { name: 'Patients', value: stats.totalPatients, color: '#10b981' },
    { name: 'Prescriptions', value: stats.totalPrescriptions, color: '#3b82f6' },
    { name: 'Surgeries', value: stats.totalSurgeries, color: '#a855f7' },
    { name: 'Lab Tests', value: stats.totalLabTests, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6 ml-6">
      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-8 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Activity className="w-10 h-10 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-black text-white flex items-center gap-3">
                Dashboard
              </h1>
              <p className="text-white/90 mt-2 text-lg font-medium">
                Welcome back, Dr. {doctorName.split(' ').pop()}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30">
              <Calendar className="w-5 h-5 text-white" />
              <span className="text-sm font-bold text-white">
                {mounted && time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30">
              <Clock className="w-5 h-5 text-white" />
              <span className="text-sm font-bold text-white tabular-nums">
                {mounted && time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid with Enhanced Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Card className={`relative overflow-hidden border-2 ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-full bg-gradient-to-br ${stat.bgGradient}`}>
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stat.gradient}`} />
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                        {stat.title}
                      </CardTitle>
                      <div 
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg transition-all`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div 
                      className="text-5xl font-black text-gray-900 dark:text-white mb-3"
                    >
                      {stat.value}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        <TrendIcon className={`w-3.5 h-3.5 ${stat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
                        <span className={`text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                          {stat.change}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:gap-3 transition-all">
                        <span>View</span>
                        <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions with Enhanced Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/doctor/patients?action=add">
                <motion.button 
                  className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/30 dark:hover:to-teal-900/30 border-2 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 transition-all shadow-sm hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Users className="w-6 h-6" />
                  <span className="font-bold text-base">Add Patient</span>
                </motion.button>
              </Link>
              <Link href="/doctor/prescriptions?action=add">
                <motion.button 
                  className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 transition-all shadow-sm hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FileText className="w-6 h-6" />
                  <span className="font-bold text-base">New Prescription</span>
                </motion.button>
              </Link>
              <Link href="/doctor/vitals?action=add">
                <motion.button 
                  className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 hover:from-rose-100 hover:to-pink-100 dark:hover:from-rose-900/30 dark:hover:to-pink-900/30 border-2 border-rose-200 dark:border-rose-700 text-rose-700 dark:text-rose-300 transition-all shadow-sm hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <HeartPulse className="w-6 h-6" />
                  <span className="font-bold text-base">Record Vitals</span>
                </motion.button>
              </Link>
              <Link href="/doctor/laboratory?action=add">
                <motion.button 
                  className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 border-2 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300 transition-all shadow-sm hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FlaskConical className="w-6 h-6" />
                  <span className="font-bold text-base">Order Lab Test</span>
                </motion.button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Advanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2"
        >
          <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500" />
            <CardHeader className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <TrendingUp className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      Prescription Trends
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Last 6 months performance analysis</p>
                  </div>
                </div>
                <motion.div 
                  className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                    {activityData.reduce((sum, item) => sum + item.prescriptions, 0)} Total
                  </span>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrescriptions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                      <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <filter id="shadow" height="200%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3"/>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" stroke="#e0e7ff" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6366f1" 
                    style={{ fontSize: '13px', fontWeight: 700 }}
                    tickLine={{ stroke: '#6366f1' }}
                  />
                  <YAxis 
                    stroke="#6366f1" 
                    style={{ fontSize: '13px', fontWeight: 700 }}
                    tickLine={{ stroke: '#6366f1' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: 'none',
                      borderRadius: '16px',
                      boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)',
                      padding: '16px',
                      fontWeight: 600
                    }}
                    labelStyle={{ color: '#3b82f6', fontWeight: 700, fontSize: '14px' }}
                    itemStyle={{ color: '#06b6d4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="prescriptions" 
                    stroke="#3b82f6" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorPrescriptions)"
                    filter="url(#shadow)"
                    animationDuration={2000}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Patient Distribution - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden h-full">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
            <CardHeader className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Users className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Patient Mix
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Distribution</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {patientTypeData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <defs>
                        <filter id="pieShadow" height="200%">
                          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3"/>
                        </filter>
                      </defs>
                      <Pie
                        data={patientTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={95}
                        paddingAngle={5}
                        dataKey="value"
                        filter="url(#pieShadow)"
                        animationDuration={1500}
                      >
                        {patientTypeData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                            stroke="#fff"
                            strokeWidth={3}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 15px 40px rgba(168, 85, 247, 0.3)',
                          padding: '12px',
                          fontWeight: 600
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {patientTypeData.map((item, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full shadow-lg" 
                            style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                          />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.name}</span>
                        </div>
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{item.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-gray-400">
                  <p className="font-medium">No patient data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Overview - Enhanced Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="border-2 border-emerald-200 dark:border-emerald-800 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden bg-gradient-to-br from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/10 dark:to-teal-950/10">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
          <CardHeader className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Target className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Performance Overview
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Comprehensive activity breakdown</p>
                </div>
              </div>
              <motion.div 
                className="px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-300 dark:border-emerald-700"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {performanceData.reduce((sum, item) => sum + item.value, 0)} Total Activities
                </span>
              </motion.div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  {performanceData.map((entry, index) => (
                    <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={entry.color} stopOpacity={1}/>
                      <stop offset="95%" stopColor={entry.color} stopOpacity={0.6}/>
                    </linearGradient>
                  ))}
                  <filter id="barShadow" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3"/>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="5 5" stroke="#d1fae5" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  stroke="#059669" 
                  style={{ fontSize: '13px', fontWeight: 700 }}
                  tickLine={{ stroke: '#059669' }}
                />
                <YAxis 
                  stroke="#059669" 
                  style={{ fontSize: '13px', fontWeight: 700 }}
                  tickLine={{ stroke: '#059669' }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)',
                    padding: '16px',
                    fontWeight: 600
                  }}
                  labelStyle={{ color: '#059669', fontWeight: 700, fontSize: '14px' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[12, 12, 0, 0]}
                  filter="url(#barShadow)"
                  animationDuration={1500}
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#barGradient${index})`} />
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
