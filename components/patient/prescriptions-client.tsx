'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, User, Pill, Search, CheckCircle2, Clock, RotateCcw, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface Prescription {
  PRES_ID: number;
  PRES_NUMBER: string;
  PRES_MEDICATION: string;
  PRES_DOSAGE: string;
  PRES_FREQUENCY: string;
  PRES_DURATION: string;
  PRES_DOC_NAME: string;
  PRES_STATUS: string;
  PRES_REFILLS_REMAINING: number;
  PRES_NOTES: string;
  PRES_DATE: string;
}

interface PrescriptionsClientProps {
  prescriptions: Prescription[];
}

export default function PatientPrescriptionsClient({ prescriptions }: PrescriptionsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((pres) =>
      `${pres.PRES_MEDICATION || ''} ${pres.PRES_DOC_NAME || ''} ${pres.PRES_NUMBER || ''} ${pres.PRES_STATUS || ''} ${pres.PRES_NOTES || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [prescriptions, searchTerm]);

  // Dynamic KPI Stats
  const activeCount = useMemo(() => {
    return prescriptions.filter((p) => p.PRES_STATUS?.toLowerCase().includes('active')).length;
  }, [prescriptions]);

  const completedCount = useMemo(() => {
    return prescriptions.filter((p) => p.PRES_STATUS?.toLowerCase().includes('complete')).length;
  }, [prescriptions]);

  const totalRefills = useMemo(() => {
    return prescriptions.reduce((sum, p) => sum + (Number(p.PRES_REFILLS_REMAINING) || 0), 0);
  }, [prescriptions]);

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('active')) return 'badge-success';
    if (s.includes('complete')) return 'badge-info';
    if (s.includes('pending')) return 'badge-warning';
    if (s.includes('cancel')) return 'badge-danger';
    return 'badge-info';
  };

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
              My Prescriptions & Medications
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {prescriptions.length} Prescriptions
            </span>
          </div>
          <p className="text-muted mt-1">
            Active physician medication orders, dosage schedules, dispensing instructions, and refill allowances
          </p>
        </motion.div>
      </div>

      {/* Bento KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Total Prescriptions</p>
              <p className="text-2xl font-bold text-heading mt-1">{prescriptions.length}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Active Medications</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{activeCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Completed Regimens</p>
              <p className="text-2xl font-bold text-heading mt-1">{completedCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Available Refills</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{totalRefills}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
              <RotateCcw className="w-5 h-5" />
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
              placeholder="Search by medication name, doctor, Rx number, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-hospital pl-10 h-11"
            />
          </div>
        </Card>
      </motion.div>

      {/* Prescriptions Grid */}
      {filteredPrescriptions.length === 0 ? (
        <Card className="card p-12 text-center border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mx-auto mb-4 flex items-center justify-center text-cyan-400">
            <Pill className="w-8 h-8" />
          </div>
          <p className="text-heading font-semibold text-lg">No prescriptions found</p>
          <p className="text-muted text-sm mt-1">Prescriptions written by your doctor will automatically appear here</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredPrescriptions.map((prescription, index) => (
              <motion.div
                key={prescription.PRES_ID}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.04 }}
              >
                <Card className="card overflow-hidden border border-slate-700/50 hover:border-cyan-500/40 transition-all bg-slate-900/60 backdrop-blur-xl shadow-lg hover:shadow-cyan-500/5">
                  <div className="h-1 bg-gradient-to-r from-sky-500 via-teal-500 to-cyan-500" />
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-heading">
                            {prescription.PRES_MEDICATION}
                          </CardTitle>
                          <p className="text-xs text-muted mt-0.5 flex items-center gap-2">
                            <span className="font-mono text-cyan-400 font-medium">Rx #{prescription.PRES_NUMBER}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-300">
                              <Stethoscope className="w-3 h-3 text-cyan-400" />
                              {prescription.PRES_DOC_NAME || 'Attending Physician'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`badge ${getStatusBadge(prescription.PRES_STATUS)}`}>
                          {prescription.PRES_STATUS || 'Active'}
                        </Badge>
                        <span className="text-xs text-muted font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          {formatDate(prescription.PRES_DATE)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Dosage</span>
                        <span className="text-sm font-semibold text-heading mt-0.5 block">{prescription.PRES_DOSAGE || 'Standard'}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Frequency</span>
                        <span className="text-sm font-semibold text-heading mt-0.5 block">{prescription.PRES_FREQUENCY || 'Once Daily'}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Duration</span>
                        <span className="text-sm font-semibold text-heading mt-0.5 block">{prescription.PRES_DURATION || '7 Days'}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Refills Left</span>
                        <span className="text-sm font-bold font-mono text-amber-400 mt-0.5 block">{prescription.PRES_REFILLS_REMAINING || 0}</span>
                      </div>
                    </div>
                    {prescription.PRES_NOTES && (
                      <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/30 text-xs text-muted">
                        <span className="font-semibold text-slate-300 block mb-0.5">Doctor Instructions:</span>
                        <p>{prescription.PRES_NOTES}</p>
                      </div>
                    )}
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
