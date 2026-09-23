'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { HeartPulse, Loader2, Plus, Edit, Trash2, Search, Thermometer, Wind, Activity, User, UserCheck } from 'lucide-react';
import { VitalsForm } from './vitals-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';
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
  VIT_PAT_NUMBER: string;
  VIT_PAT_NAME: string;
  VIT_WEIGHT: number;
  VIT_BODYTEMP: number;
  VIT_BLOOD_PRESSURE: string;
  VIT_HEARTPULSE: number;
  VIT_RESPIRATION: number;
  VIT_OXYGEN_SAT: number;
  VIT_RECORDED_BY: string;
  VIT_RECORDED_DATE: string;
  PAT_FNAME?: string;
  PAT_LNAME?: string;
  PAT_NUMBER?: string;
}

export default function DoctorVitalsClient() {
  const safeDelete = useSafeDelete();
  const searchParams = useSearchParams();
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorNumber, setDoctorNumber] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingVital, setEditingVital] = useState<Vital | undefined>();

  useEffect(() => {
    fetchVitals();
    if (searchParams.get('action') === 'add') {
      setFormOpen(true);
    }
  }, [searchParams]);

  const fetchVitals = async (skipCache = false) => {
    try {
      if (vitals.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/vitals');
        invalidateApiCache('/api/doctors');
      }
      const doctor = await fetchWithCache<any>('/api/doctors/me');
      setDoctorNumber(doctor.DOC_NUMBER);

      const data = await fetchWithCache<Vital[]>(`/api/doctors/${doctor.DOC_NUMBER}/vitals`);
      setVitals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching vitals:', error);
      if (vitals.length === 0) {
        toast.error('Failed to load vitals');
        setVitals([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vital: Vital) => {
    setEditingVital(vital);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingVital(undefined);
    setFormOpen(true);
  };

  function handleDelete(vital: Vital) {
    safeDelete.requestDelete({
      url: `/api/vitals?id=${vital.VIT_ID}`,
      itemType: 'Vital Record',
      itemTitle: `${vital.VIT_PAT_NAME || 'Patient'} (${vital.VIT_PAT_NUMBER})`,
      successMessage: 'Vital record deleted successfully',
      onSuccess: () => fetchVitals(true),
    });
  }

  const handleFormSuccess = () => {
    fetchVitals(true);
    setEditingVital(undefined);
  };

  const filteredVitals = useMemo(() => {
    return vitals.filter((vital) => {
      const patientName = vital.VIT_PAT_NAME || `${vital.PAT_FNAME || ''} ${vital.PAT_LNAME || ''}`;
      return `${patientName} ${vital.VIT_PAT_NUMBER || ''} ${vital.VIT_BLOOD_PRESSURE || ''} ${vital.VIT_RECORDED_BY || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [vitals, searchTerm]);

  // Dynamic KPI Stats
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

  const uniquePatients = useMemo(() => {
    const set = new Set(vitals.map((v) => v.VIT_PAT_NUMBER).filter(Boolean));
    return set.size;
  }, [vitals]);

  return (
    <>
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
                Patient Vital Signs
              </h1>
              <span className="badge-counter">
                {vitals.length} Logs
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Real-time physiological telemetry, blood pressure, pulse, and oxygenation
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={handleAddNew}
              className="btn-primary flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record Vitals</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-border shadow-md hover:border-primary/50 transition-all relative overflow-hidden bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted">Total Recorded Sessions</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-heading mt-1">{vitals.length}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-primary shadow-sm">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <EcgSparkline color="#06B6D4" width={90} height={24} />
            </div>
          </Card>

          <Card className="card p-4 border border-border shadow-md hover:border-primary/50 transition-all bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted">Patients Monitored</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-heading mt-1">{uniquePatients}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-success shadow-sm">
                <User className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-3 flex items-center gap-1">
              <span>●</span> Active round cohort
            </p>
          </Card>

          <Card className="card p-4 border border-border shadow-md hover:border-primary/50 transition-all relative overflow-hidden bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted">Average Heart Rate</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-heading mt-1">{avgPulse} <span className="text-sm font-semibold text-muted">bpm</span></p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-danger shadow-sm">
                <HeartPulse className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <EcgSparkline color="#F43F5E" width={90} height={24} />
            </div>
          </Card>

          <Card className="card p-4 border border-border shadow-md hover:border-primary/50 transition-all bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted">Mean Temperature</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-heading mt-1">{avgTemp} <span className="text-sm font-semibold text-muted">°F</span></p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-warning shadow-sm">
                <Thermometer className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-3 flex items-center gap-1">
              <span>●</span> Normothermic baseline
            </p>
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
                placeholder="Search vitals by patient name, patient number, blood pressure, or clinician..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-hospital pl-10 h-11 text-sm font-medium"
              />
            </div>
          </Card>
        </motion.div>

        {/* Card Grid View */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : filteredVitals.length === 0 ? (
          <Card className="card p-12 text-center border border-border bg-card">
            <div className="w-16 h-16 rounded-2xl kpi-icon-primary mx-auto mb-4 flex items-center justify-center shadow-sm">
              <HeartPulse className="w-8 h-8" />
            </div>
            <p className="text-heading font-bold text-lg">No vitals recorded</p>
            <p className="text-muted text-sm mt-1">Try adjusting your search query or record new patient vitals</p>
            <Button onClick={handleAddNew} className="btn-primary mt-4">
              <Plus className="w-4 h-4 mr-1.5" /> Record First Vitals
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredVitals.map((vital, index) => {
                const patientName = vital.VIT_PAT_NAME || `${vital.PAT_FNAME || ''} ${vital.PAT_LNAME || ''}`.trim() || 'Patient';
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
                    <Card className="card overflow-hidden border border-border shadow-md hover:shadow-xl transition-all bg-card">
                      <div className="card-accent-bar" />
                      <CardHeader className="flex flex-row items-start justify-between pb-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-xl kpi-icon-primary shrink-0 shadow-sm">
                            <HeartPulse className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <CardTitle className="text-lg font-bold text-heading tracking-tight">
                                {patientName}
                              </CardTitle>
                              <span className={`badge-subaction font-bold text-[10px] py-0.5 px-2 ${bpEval.badgeClass}`}>
                                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: bpEval.dotColor }} />
                                {bpEval.label}
                              </span>
                            </div>
                            <p className="text-xs text-muted font-semibold mt-0.5 flex items-center gap-1.5">
                              <span className="table-id-link font-bold">{vital.VIT_PAT_NUMBER}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted font-medium">{formatDate(vital.VIT_RECORDED_DATE)}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(vital)}
                            className="table-action-edit hover-lift cursor-pointer h-8 w-8"
                            title="Edit Vitals"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(vital)}
                            disabled={safeDelete.isDeleting}
                            className="table-action-delete hover-lift cursor-pointer h-8 w-8"
                            title="Delete Vitals"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
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

      <VitalsForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingVital(undefined);
        }}
        onSuccess={handleFormSuccess}
        vital={editingVital}
        doctorNumber={doctorNumber}
      />

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
