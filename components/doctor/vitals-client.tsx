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

  const fetchVitals = async () => {
    try {
      setLoading(true);
      const doctorResponse = await fetch('/api/doctors/me');
      if (!doctorResponse.ok) throw new Error('Failed to fetch doctor data');
      const doctor = await doctorResponse.json();
      setDoctorNumber(doctor.DOC_NUMBER);

      const response = await fetch(`/api/doctors/${doctor.DOC_NUMBER}/vitals`);
      if (!response.ok) throw new Error('Failed to fetch vitals');
      const data = await response.json();
      setVitals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching vitals:', error);
      toast.error('Failed to load vitals');
      setVitals([]);
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
      onSuccess: fetchVitals,
    });
  }

  const handleFormSuccess = () => {
    fetchVitals();
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-heading">
                Patient Vital Signs
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {vitals.length} Logs
              </span>
            </div>
            <p className="text-muted mt-1">
              Real-time physiological telemetry, blood pressure, heart rates, respiration, and SpO2 tracking
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={handleAddNew}
              className="btn-primary flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Record Vitals</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Recorded Sessions</p>
                <p className="text-2xl font-bold text-heading mt-1">{vitals.length}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Patients Monitored</p>
                <p className="text-2xl font-bold text-heading mt-1">{uniquePatients}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
                <User className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Average Heart Rate</p>
                <p className="text-2xl font-bold text-heading mt-1">{avgPulse} bpm</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500/20 to-red-500/20 border border-rose-500/30 text-rose-400">
                <HeartPulse className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Mean Temperature</p>
                <p className="text-2xl font-bold text-heading mt-1">{avgTemp} °F</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
                <Thermometer className="w-5 h-5" />
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
                placeholder="Search vitals by patient name, patient number, blood pressure, or clinician..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-hospital pl-10 h-11"
              />
            </div>
          </Card>
        </motion.div>

        {/* Card Grid View */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
          </div>
        ) : filteredVitals.length === 0 ? (
          <Card className="card p-12 text-center border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mx-auto mb-4 flex items-center justify-center text-cyan-400">
              <HeartPulse className="w-8 h-8" />
            </div>
            <p className="text-heading font-semibold text-lg">No vitals recorded</p>
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
                return (
                  <motion.div
                    key={vital.VIT_ID}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Card className="card overflow-hidden border border-slate-700/50 hover:border-cyan-500/40 transition-all bg-slate-900/60 backdrop-blur-xl shadow-lg hover:shadow-cyan-500/5">
                      <div className="h-1 bg-gradient-to-r from-sky-500 via-teal-500 to-cyan-500" />
                      <CardHeader className="flex flex-row items-start justify-between pb-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                            <HeartPulse className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-heading">
                              {patientName}
                            </CardTitle>
                            <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                              <span className="font-mono text-cyan-400 font-medium">{vital.VIT_PAT_NUMBER}</span>
                              <span>•</span>
                              <span>{formatDate(vital.VIT_RECORDED_DATE)}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(vital)}
                            className="hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all hover-lift cursor-pointer h-8 w-8"
                            title="Edit Vitals"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(vital)}
                            disabled={safeDelete.isDeleting}
                            className="hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all hover-lift cursor-pointer h-8 w-8"
                            title="Delete Vitals"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                            <span className="text-muted block text-[10px] uppercase font-semibold">Blood Pressure</span>
                            <span className="font-mono font-bold text-cyan-400 mt-0.5 block">{vital.VIT_BLOOD_PRESSURE || '120/80'}</span>
                          </div>
                          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                            <span className="text-muted block text-[10px] uppercase font-semibold">Heart Rate</span>
                            <span className="font-mono font-bold text-rose-400 mt-0.5 block">{vital.VIT_HEARTPULSE} bpm</span>
                          </div>
                          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                            <span className="text-muted block text-[10px] uppercase font-semibold">Temperature</span>
                            <span className="font-mono font-bold text-amber-400 mt-0.5 block">{vital.VIT_BODYTEMP}°F</span>
                          </div>
                          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                            <span className="text-muted block text-[10px] uppercase font-semibold">Respiration</span>
                            <span className="font-mono font-bold text-emerald-400 mt-0.5 block">{vital.VIT_RESPIRATION || 16}/min</span>
                          </div>
                        </div>
                        {vital.VIT_RECORDED_BY && (
                          <div className="mt-2.5 flex items-center justify-between text-xs text-muted pt-2 border-t border-slate-800">
                            <span>Recorded by: <span className="font-medium text-slate-300">{vital.VIT_RECORDED_BY}</span></span>
                            {vital.VIT_WEIGHT && <span>Weight: <span className="font-mono text-slate-300">{vital.VIT_WEIGHT} kg</span></span>}
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
