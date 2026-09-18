'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Activity, HeartPulse, Thermometer, Wind, User, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import VitalsForm from './vitals-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';

interface Vitals {
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
}

export default function VitalsClient() {
  const safeDelete = useSafeDelete();
  const [vitals, setVitals] = useState<Vitals[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVitals, setEditingVitals] = useState<Vitals | null>(null);

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async (skipCache = false) => {
    try {
      if (vitals.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/vitals');
      }
      const data = await fetchWithCache<Vitals[]>('/api/vitals');
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

  function handleDelete(vital: Vitals) {
    safeDelete.requestDelete({
      url: `/api/vitals?id=${vital.VIT_ID}`,
      itemType: 'Vitals Record',
      itemTitle: `${vital.VIT_PAT_NAME || 'Patient'} (${vital.VIT_PAT_NUMBER})`,
      successMessage: 'Vitals record deleted successfully',
      onSuccess: () => fetchVitals(true),
    });
  }

  const handleEdit = (vital: Vitals) => {
    setEditingVitals(vital);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingVitals(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVitals(null);
  };

  const handleSuccess = () => {
    fetchVitals(true);
    handleCloseForm();
  };

  const filteredVitals = useMemo(() => {
    return vitals.filter((vital) =>
      `${vital.VIT_PAT_NAME || ''} ${vital.VIT_PAT_NUMBER || ''} ${vital.VIT_RECORDED_BY || ''} ${vital.VIT_BLOOD_PRESSURE || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
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
              Physiological metrics, blood pressure readings, pulse, respiratory rate, and oxygen saturation
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
                <p className="text-xs text-muted font-medium">Monitored Patients</p>
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
                <p className="text-xs text-muted font-medium">Average Temperature</p>
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

        {/* Table View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card overflow-hidden border border-slate-700/50 shadow-xl bg-slate-900/60 backdrop-blur-xl">
            <div className="h-1 bg-gradient-to-r from-sky-500 via-teal-500 to-cyan-500" />
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
                <p className="text-body font-medium">Loading vital signs...</p>
              </div>
            ) : filteredVitals.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-slate-800/80 text-muted border border-slate-700">
                  <Activity className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No vital records found</p>
                <p className="text-muted text-sm">Try adjusting your search query or record new patient vitals</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> Record Vitals
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-28">Patient No.</th>
                      <th className="w-52">Patient Name</th>
                      <th className="w-36">Blood Pressure</th>
                      <th className="w-28">Pulse</th>
                      <th className="w-28">Temp</th>
                      <th className="w-28">Resp</th>
                      <th className="w-44">Recorded By</th>
                      <th className="w-32">Date</th>
                      <th className="text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredVitals.map((vital, index) => (
                        <motion.tr
                          key={vital.VIT_ID}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <td className="font-mono text-cyan-400 font-medium">
                            {vital.VIT_PAT_NUMBER}
                          </td>
                          <td className="font-semibold text-heading">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-cyan-400 shrink-0" />
                              <span>{vital.VIT_PAT_NAME || 'Patient'}</span>
                            </div>
                          </td>
                          <td>
                            <span className="font-mono font-semibold px-2.5 py-0.5 rounded-full text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                              {vital.VIT_BLOOD_PRESSURE || '120/80'} mmHg
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-1 font-mono text-xs text-rose-400 font-medium">
                              <HeartPulse className="w-3.5 h-3.5" />
                              <span>{vital.VIT_HEARTPULSE} bpm</span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-1 font-mono text-xs text-amber-400 font-medium">
                              <Thermometer className="w-3.5 h-3.5" />
                              <span>{vital.VIT_BODYTEMP}°F</span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-1 font-mono text-xs text-emerald-400 font-medium">
                              <Wind className="w-3.5 h-3.5" />
                              <span>{vital.VIT_RESPIRATION || 16}/min</span>
                            </div>
                          </td>
                          <td className="text-body text-sm font-medium">
                            <div className="flex items-center gap-1.5 text-xs text-slate-300">
                              <UserCheck className="w-3.5 h-3.5 text-muted" />
                              <span>{vital.VIT_RECORDED_BY || 'Clinical Staff'}</span>
                            </div>
                          </td>
                          <td className="text-muted text-xs">
                            {formatDate(vital.VIT_RECORDED_DATE)}
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(vital)}
                                className="hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all hover-lift cursor-pointer"
                                title="Edit Vitals"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(vital)}
                                disabled={safeDelete.isDeleting}
                                className="hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all hover-lift cursor-pointer"
                                title="Delete Vitals"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <VitalsForm
        open={showForm}
        vitals={editingVitals}
        onClose={handleCloseForm}
        onSuccess={handleSuccess}
      />

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
