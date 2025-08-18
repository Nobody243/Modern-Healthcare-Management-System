'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Calendar, User, Clock, Search, CheckCircle2, Stethoscope, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface Surgery {
  SURG_ID: number;
  SURG_NUMBER: string;
  SURG_TYPE: string;
  SURG_DOC_NAME: string;
  SURG_DATE: string;
  SURG_DURATION: string;
  SURG_STATUS: string;
  SURG_NOTES: string;
}

interface SurgeriesClientProps {
  surgeries: Surgery[];
}

export default function PatientSurgeriesClient({ surgeries }: SurgeriesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSurgeries = useMemo(() => {
    return surgeries.filter((surgery) =>
      `${surgery.SURG_TYPE || ''} ${surgery.SURG_DOC_NAME || ''} ${surgery.SURG_NUMBER || ''} ${surgery.SURG_STATUS || ''} ${surgery.SURG_NOTES || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [surgeries, searchTerm]);

  // Dynamic KPI Stats
  const completedCount = useMemo(() => {
    return surgeries.filter((s) => s.SURG_STATUS?.toLowerCase().includes('complete')).length;
  }, [surgeries]);

  const scheduledCount = useMemo(() => {
    return surgeries.filter((s) => s.SURG_STATUS?.toLowerCase().includes('schedule')).length;
  }, [surgeries]);

  const inProgressCount = useMemo(() => {
    return surgeries.filter((s) => s.SURG_STATUS?.toLowerCase().includes('progress')).length;
  }, [surgeries]);

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('complete')) return 'badge-success';
    if (s.includes('schedule')) return 'badge-info';
    if (s.includes('progress')) return 'badge-warning';
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
              My Surgical Records
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {surgeries.length} Procedures
            </span>
          </div>
          <p className="text-muted mt-1">
            Operation theatre logs, operative procedure summaries, lead surgical teams, and recovery updates
          </p>
        </motion.div>
      </div>

      {/* Bento KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Total OT Procedures</p>
              <p className="text-2xl font-bold text-heading mt-1">{surgeries.length}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
              <Scissors className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Completed Surgeries</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{completedCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Scheduled OT Dates</p>
              <p className="text-2xl font-bold text-heading mt-1">{scheduledCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">In Theater / Active</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{inProgressCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
              <Activity className="w-5 h-5" />
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
              placeholder="Search surgeries by procedure type, surgeon, or surgery code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-hospital pl-10 h-11"
            />
          </div>
        </Card>
      </motion.div>

      {/* Surgeries Grid */}
      {filteredSurgeries.length === 0 ? (
        <Card className="card p-12 text-center border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mx-auto mb-4 flex items-center justify-center text-cyan-400">
            <Scissors className="w-8 h-8" />
          </div>
          <p className="text-heading font-semibold text-lg">No surgical records found</p>
          <p className="text-muted text-sm mt-1">Surgical procedures scheduled or performed will appear here</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredSurgeries.map((surgery, index) => (
              <motion.div
                key={surgery.SURG_ID}
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
                          <Scissors className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-heading">
                            {surgery.SURG_TYPE || 'Surgical Procedure'}
                          </CardTitle>
                          <p className="text-xs text-muted mt-0.5 flex items-center gap-2">
                            <span className="font-mono text-cyan-400 font-medium">#{surgery.SURG_NUMBER}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-300">
                              <Stethoscope className="w-3 h-3 text-cyan-400" />
                              Lead: {surgery.SURG_DOC_NAME || 'Surgical Specialist'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`badge ${getStatusBadge(surgery.SURG_STATUS)}`}>
                          {surgery.SURG_STATUS || 'Scheduled'}
                        </Badge>
                        <span className="text-xs text-muted font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          {formatDate(surgery.SURG_DATE)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Procedure Date</span>
                        <span className="text-sm font-semibold text-heading mt-0.5 block">{formatDate(surgery.SURG_DATE)}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Duration</span>
                        <span className="text-sm font-semibold text-heading mt-0.5 block">{surgery.SURG_DURATION || '—'}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Lead Surgeon</span>
                        <span className="text-sm font-semibold text-heading mt-0.5 block truncate">{surgery.SURG_DOC_NAME || 'Staff Surgeon'}</span>
                      </div>
                    </div>
                    {surgery.SURG_NOTES && (
                      <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/30 text-xs text-muted">
                        <span className="font-semibold text-slate-300 block mb-0.5">Operative & Recovery Notes:</span>
                        <p>{surgery.SURG_NOTES}</p>
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
