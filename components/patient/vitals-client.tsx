'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Calendar, Thermometer, HeartPulse, Weight, Wind, Droplets, User, Search, Clock, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface Vital {
  VIT_ID: number;
  VIT_BODYTEMP: number;
  VIT_BLOOD_PRESSURE: string;
  VIT_HEARTPULSE: number;
  VIT_OXYGEN_SAT: number;
  VIT_RESPIRATION: number;
  VIT_WEIGHT: number;
  VIT_RECORDED_DATE: string;
  VIT_RECORDED_BY: string;
}

interface VitalsClientProps {
  vitals: Vital[];
}

export default function PatientVitalsClient({ vitals }: VitalsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVitals = useMemo(() => {
    return vitals.filter((vital) =>
      `${vital.VIT_BLOOD_PRESSURE || ''} ${vital.VIT_RECORDED_BY || ''} ${vital.VIT_RECORDED_DATE || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [vitals, searchTerm]);

  // Dynamic KPI Stats
  const latestVital = vitals[0];
  const avgPulse = useMemo(() => {
    if (vitals.length === 0) return 0;
    const sum = vitals.reduce((acc, v) => acc + (Number(v.VIT_HEARTPULSE) || 0), 0);
    return Math.round(sum / vitals.length);
  }, [vitals]);

  const avgTemp = useMemo(() => {
    if (vitals.length === 0) return 0;
    const sum = vitals.reduce((acc, v) => acc + (Number(v.VIT_BODYTEMP) || 0), 0);
    return (sum / vitals.length).toFixed(1);
  }, [vitals]);

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-heading">
              My Vital Signs & Biometrics
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {vitals.length} Recorded Readings
            </span>
          </div>
          <p className="text-muted mt-1">
            Personal health tracker, blood pressure trends, resting pulse rate, body temperature, and respiration logs
          </p>
        </motion.div>
      </div>

      {/* Bento KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Latest Blood Pressure</p>
              <p className="text-2xl font-bold text-cyan-400 font-mono mt-1">
                {latestVital?.VIT_BLOOD_PRESSURE || '120/80'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Average Heart Pulse</p>
              <p className="text-2xl font-bold text-rose-400 font-mono mt-1">
                {avgPulse} bpm
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500/20 to-red-500/20 border border-rose-500/30 text-rose-400">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Mean Body Temp</p>
              <p className="text-2xl font-bold text-amber-400 font-mono mt-1">
                {avgTemp} °F
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Total History Logs</p>
              <p className="text-2xl font-bold text-heading mt-1">{vitals.length}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Frosted Filter & Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="card-glass p-4 border border-slate-700/50 shadow-md backdrop-blur-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              placeholder="Search vitals by blood pressure reading, clinician name, or recorded date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-hospital pl-10 h-11"
            />
          </div>
        </Card>
      </motion.div>

      {/* Vitals Grid */}
      {filteredVitals.length === 0 ? (
        <Card className="card p-12 text-center border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mx-auto mb-4 flex items-center justify-center text-cyan-400">
            <Activity className="w-8 h-8" />
          </div>
          <p className="text-heading font-semibold text-lg">No vital sign records found</p>
          <p className="text-muted text-sm mt-1">Your recorded vitals will appear here after clinical rounds</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredVitals.map((vital, index) => (
              <motion.div
                key={vital.VIT_ID}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.04 }}
              >
                <Card className="card overflow-hidden border border-slate-700/50 hover:border-cyan-500/40 transition-all bg-slate-900/60 backdrop-blur-xl shadow-lg hover:shadow-cyan-500/5">
                  <div className="h-1 bg-gradient-to-r from-sky-500 via-teal-500 to-cyan-500" />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-heading">
                            Clinical Vital Measurement
                          </CardTitle>
                          {vital.VIT_RECORDED_BY && (
                            <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                              <User className="w-3 h-3 text-cyan-400" />
                              <span>Recorded by: <span className="font-medium text-slate-300">{vital.VIT_RECORDED_BY}</span></span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted font-medium">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{formatDate(vital.VIT_RECORDED_DATE)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                        <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold mb-1">
                          <Activity className="w-3.5 h-3.5" />
                          <span>Blood Pressure</span>
                        </div>
                        <p className="text-lg font-bold font-mono text-cyan-400">
                          {vital.VIT_BLOOD_PRESSURE || '120/80'}
                        </p>
                        <span className="text-[10px] text-muted block">mmHg</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                        <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold mb-1">
                          <HeartPulse className="w-3.5 h-3.5" />
                          <span>Heart Pulse</span>
                        </div>
                        <p className="text-lg font-bold font-mono text-rose-400">
                          {vital.VIT_HEARTPULSE || 72}
                        </p>
                        <span className="text-[10px] text-muted block">beats / min</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-1">
                          <Thermometer className="w-3.5 h-3.5" />
                          <span>Temperature</span>
                        </div>
                        <p className="text-lg font-bold font-mono text-amber-400">
                          {vital.VIT_BODYTEMP || 98.6}°F
                        </p>
                        <span className="text-[10px] text-muted block">Oral Probe</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                          <Wind className="w-3.5 h-3.5" />
                          <span>Respiration</span>
                        </div>
                        <p className="text-lg font-bold font-mono text-emerald-400">
                          {vital.VIT_RESPIRATION || 16}
                        </p>
                        <span className="text-[10px] text-muted block">breaths / min</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                        <div className="flex items-center gap-1.5 text-purple-400 text-xs font-semibold mb-1">
                          <Droplets className="w-3.5 h-3.5" />
                          <span>Oxygen Sat</span>
                        </div>
                        <p className="text-lg font-bold font-mono text-purple-400">
                          {vital.VIT_OXYGEN_SAT ? `${vital.VIT_OXYGEN_SAT}%` : '98%'}
                        </p>
                        <span className="text-[10px] text-muted block">SpO2 Pulse Ox</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                        <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold mb-1">
                          <Weight className="w-3.5 h-3.5" />
                          <span>Weight</span>
                        </div>
                        <p className="text-lg font-bold font-mono text-blue-400">
                          {vital.VIT_WEIGHT || '—'}
                        </p>
                        <span className="text-[10px] text-muted block">Kilograms</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
