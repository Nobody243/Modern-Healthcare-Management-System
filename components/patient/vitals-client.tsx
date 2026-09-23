'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Calendar, Thermometer, HeartPulse, Wind, User, Search, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import { EcgSparkline } from '@/components/ui/ecg-sparkline';
import {
  evaluateBloodPressure,
  calculateMAP,
  evaluateHeartRate,
  evaluateBodyTemp,
  evaluateSpO2,
} from '@/lib/vitals-evaluator';

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-heading tracking-tight">
              My Physiological Vitals
            </h1>
            <span className="badge-counter">
              {vitals.length} Recorded Sets
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Personal health tracker, blood pressure trends, resting pulse, and oxygenation
          </p>
        </motion.div>
      </div>

      {/* Bento KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Latest Blood Pressure</p>
              <p className="text-2xl font-bold text-heading font-mono mt-1">
                {latestVital?.VIT_BLOOD_PRESSURE || '120/80'}
              </p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-primary">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <EcgSparkline color="#06B6D4" width={80} height={22} />
          </div>
        </Card>

        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Average Heart Pulse</p>
              <p className="text-2xl font-bold text-heading font-mono mt-1">
                {avgPulse} bpm
              </p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-danger">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <EcgSparkline color="#F43F5E" width={80} height={22} />
          </div>
        </Card>

        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Mean Body Temp</p>
              <p className="text-2xl font-bold text-heading font-mono mt-1">
                {avgTemp} °F
              </p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-warning">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Total History Logs</p>
              <p className="text-2xl font-bold text-heading mt-1">{vitals.length}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-info">
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
        <Card className="card-glass p-4 border border-border shadow-md">
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
        <Card className="card p-12 text-center border border-border">
          <div className="w-16 h-16 rounded-2xl kpi-icon-primary mx-auto mb-4 flex items-center justify-center">
            <Activity className="w-8 h-8" />
          </div>
          <p className="text-heading font-semibold text-lg">No vital sign records found</p>
          <p className="text-muted text-sm mt-1">Your recorded vitals will appear here after clinical rounds</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredVitals.map((vital, index) => {
              const bpEval = evaluateBloodPressure(vital.VIT_BLOOD_PRESSURE);
              const mapVal = calculateMAP(vital.VIT_BLOOD_PRESSURE);
              const pulseEval = evaluateHeartRate(vital.VIT_HEARTPULSE);
              const tempEval = evaluateBodyTemp(vital.VIT_BODYTEMP);
              const spo2Eval = evaluateSpO2(vital.VIT_OXYGEN_SAT);

              return (
                <motion.div
                  key={vital.VIT_ID}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Card className="card overflow-hidden border border-border hover:border-muted-foreground/30 transition-all shadow-md">
                    <div className="card-accent-bar" />
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl kpi-icon-primary shadow-sm">
                            <Activity className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <CardTitle className="text-lg font-bold text-heading tracking-tight">
                                Clinical Vital Measurement
                              </CardTitle>
                              <span className={`badge-subaction font-bold text-[10px] py-0.5 px-2 ${bpEval.badgeClass}`}>
                                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: bpEval.dotColor }} />
                                {bpEval.label}
                              </span>
                            </div>
                            {vital.VIT_RECORDED_BY && (
                              <p className="text-xs text-muted font-semibold mt-0.5 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-primary" />
                                <span>Recorded by: <span className="font-bold text-heading">{vital.VIT_RECORDED_BY}</span></span>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{formatDate(vital.VIT_RECORDED_DATE)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {/* Blood Pressure */}
                        <div className="vital-tile vital-tile-bp">
                          <div className="vital-label flex items-center justify-between">
                            <span>Blood Pressure</span>
                            <Activity className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <div className="mt-1.5 flex items-baseline gap-1">
                            <span className="vital-value">{vital.VIT_BLOOD_PRESSURE || '120/80'}</span>
                            <span className="vital-unit">mmHg</span>
                          </div>
                          {mapVal && (
                            <div className="text-[11px] font-mono text-cyan-700 dark:text-cyan-300 font-semibold mt-1">
                              MAP: {mapVal} mmHg
                            </div>
                          )}
                        </div>

                        {/* Heart Rate */}
                        <div className="vital-tile vital-tile-pulse">
                          <div className="vital-label flex items-center justify-between">
                            <span>Heart Rate</span>
                            <HeartPulse className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                          </div>
                          <div className="mt-1.5 flex items-baseline gap-1">
                            <span className="vital-value">{vital.VIT_HEARTPULSE || 72}</span>
                            <span className="vital-unit">bpm</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground font-semibold mt-1 truncate">
                            {pulseEval.label}
                          </div>
                        </div>

                        {/* Temperature */}
                        <div className="vital-tile vital-tile-temp">
                          <div className="vital-label flex items-center justify-between">
                            <span>Body Temp</span>
                            <Thermometer className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div className="mt-1.5 flex items-baseline gap-1">
                            <span className="vital-value">{vital.VIT_BODYTEMP || 98.6}</span>
                            <span className="vital-unit">°F</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground font-semibold mt-1 truncate">
                            {tempEval.label}
                          </div>
                        </div>

                        {/* Oxygen Saturation */}
                        <div className="vital-tile vital-tile-spo2">
                          <div className="vital-label flex items-center justify-between">
                            <span>SpO2</span>
                            <Wind className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          </div>
                          <div className="mt-1.5 flex items-baseline gap-1">
                            <span className="vital-value">{vital.VIT_OXYGEN_SAT || 98}</span>
                            <span className="vital-unit">%</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground font-semibold mt-1 truncate">
                            {spo2Eval.label}
                          </div>
                        </div>
                      </div>

                      {vital.VIT_RECORDED_BY && (
                        <div className="mt-3.5 flex items-center justify-between text-xs text-muted pt-2.5 border-t border-border font-medium">
                          <span>Recorded by: <span className="font-bold text-heading">{vital.VIT_RECORDED_BY}</span></span>
                          {vital.VIT_WEIGHT && <span>Weight: <span className="font-mono font-bold text-heading">{vital.VIT_WEIGHT} lbs</span></span>}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
