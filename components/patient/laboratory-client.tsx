'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Calendar, FileText, Search, Activity, CheckCircle2, Clock, TestTube2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

interface Lab {
  LAB_ID: number;
  LAB_NUMBER: string;
  LAB_PAT_TESTS: string;
  LAB_PAT_RESULTS: string;
  LAB_STATUS: string;
  LAB_DATE_REC: string;
  LAB_COMPLETED_DATE: string;
  LAB_PAT_AILMENT: string;
}

interface LaboratoryClientProps {
  labs: Lab[];
}

export default function PatientLaboratoryClient({ labs }: LaboratoryClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLabs = useMemo(() => {
    return labs.filter((lab) =>
      `${lab.LAB_NUMBER || ''} ${lab.LAB_PAT_TESTS || ''} ${lab.LAB_STATUS || ''} ${lab.LAB_PAT_AILMENT || ''} ${lab.LAB_PAT_RESULTS || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [labs, searchTerm]);

  // Dynamic KPI Stats
  const completedCount = useMemo(() => {
    return labs.filter((l) => l.LAB_STATUS?.toLowerCase().includes('complete')).length;
  }, [labs]);

  const inProgressCount = useMemo(() => {
    return labs.filter((l) => l.LAB_STATUS?.toLowerCase().includes('progress')).length;
  }, [labs]);

  const pendingCount = useMemo(() => {
    return labs.filter((l) => l.LAB_STATUS?.toLowerCase().includes('pending')).length;
  }, [labs]);

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('complete')) return 'badge-success';
    if (s.includes('progress')) return 'badge-info';
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
              My Laboratory Diagnostics
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {labs.length} Lab Reports
            </span>
          </div>
          <p className="text-muted mt-1">
            Pathology panel results, specimen analysis reports, blood chemistry, and laboratory diagnostics
          </p>
        </motion.div>
      </div>

      {/* Bento KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Total Ordered Tests</p>
              <p className="text-2xl font-bold text-heading mt-1">{labs.length}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Verified Results</p>
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
              <p className="text-xs text-muted font-medium">In Laboratory Assay</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{inProgressCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400">
              <TestTube2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Pending Processing</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
              <Clock className="w-5 h-5" />
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
              placeholder="Search by test number, panel type, diagnosis, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-hospital pl-10 h-11"
            />
          </div>
        </Card>
      </motion.div>

      {/* Lab Results Grid */}
      {filteredLabs.length === 0 ? (
        <Card className="card p-12 text-center border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mx-auto mb-4 flex items-center justify-center text-cyan-400">
            <FlaskConical className="w-8 h-8" />
          </div>
          <p className="text-heading font-semibold text-lg">No laboratory results found</p>
          <p className="text-muted text-sm mt-1">Diagnostic lab panels ordered by your doctor will appear here</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredLabs.map((lab, index) => (
              <motion.div
                key={lab.LAB_ID}
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
                          <FlaskConical className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-heading">
                            Lab #{lab.LAB_NUMBER}
                          </CardTitle>
                          <p className="text-xs text-muted mt-0.5">
                            Diagnosis / Indication: <span className="text-slate-300 font-medium">{lab.LAB_PAT_AILMENT || 'Clinical Pathology'}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`badge ${getStatusBadge(lab.LAB_STATUS)}`}>
                          {lab.LAB_STATUS || 'Completed'}
                        </Badge>
                        <span className="text-xs text-muted font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          {formatDate(lab.LAB_DATE_REC)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 mb-3">
                      <span className="text-muted block text-[10px] uppercase font-semibold mb-1">Ordered Panel Tests</span>
                      <p className="text-sm font-medium text-heading">{lab.LAB_PAT_TESTS || 'Standard Diagnostic Specimen Panel'}</p>
                    </div>

                    {lab.LAB_PAT_RESULTS ? (
                      <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                        <span className="font-semibold text-emerald-400 text-xs block mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pathology Findings & Results:
                        </span>
                        <p className="text-sm text-slate-200 whitespace-pre-wrap">{lab.LAB_PAT_RESULTS}</p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/30 text-xs text-muted flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>Laboratory sample processing in progress. Results will be uploaded once verified.</span>
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
