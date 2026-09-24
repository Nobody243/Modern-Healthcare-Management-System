'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Calendar, Search, CheckCircle2, Clock, TestTube2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
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
              My Laboratory Diagnostics
            </h1>
            <span className="badge-counter">
              {labs.length} Lab Reports
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Pathology panel results, specimen analysis, and diagnostic reports
          </p>
        </motion.div>
      </div>

      {/* Bento KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Total Ordered Tests</p>
              <p className="text-2xl font-bold text-heading mt-1">{labs.length}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-primary">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Verified Results</p>
              <p className="text-2xl font-bold text-heading mt-1">{completedCount}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-success">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">In Laboratory Assay</p>
              <p className="text-2xl font-bold text-heading mt-1">{inProgressCount}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-info">
              <TestTube2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Pending Processing</p>
              <p className="text-2xl font-bold text-heading mt-1">{pendingCount}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-warning">
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
        <Card className="card-glass p-4 border border-border shadow-md">
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
        <Card className="card p-12 text-center border border-border">
          <div className="w-16 h-16 rounded-2xl kpi-icon-primary mx-auto mb-4 flex items-center justify-center">
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
                <Card className="card overflow-hidden border border-border hover:border-muted-foreground/30 transition-all shadow-md">
                  <div className="card-accent-bar" />
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl kpi-icon-primary shrink-0 mt-0.5">
                        <FlaskConical className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Line 1: Lab Title and Date */}
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base sm:text-lg font-bold text-heading">
                            Lab #{lab.LAB_NUMBER}
                          </CardTitle>
                          <div className="flex items-center gap-1.5 text-xs text-muted font-semibold shrink-0 pt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>{formatDate(lab.LAB_DATE_REC)}</span>
                          </div>
                        </div>

                        {/* Line 2: Indication on left, Status Tag on right */}
                        <div className="flex items-center justify-between gap-2 mt-1.5">
                          <p className="text-xs text-muted truncate min-w-0">
                            Indication: <span className="text-foreground font-medium">{lab.LAB_PAT_AILMENT || 'Clinical Pathology'}</span>
                          </p>
                          <StatusBadge status={lab.LAB_STATUS || 'Completed'} showIcon />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="p-3 rounded-lg bg-card border border-border mb-3">
                      <span className="text-muted block text-[10px] uppercase font-semibold mb-1">Ordered Panel Tests</span>
                      <p className="text-sm font-medium text-heading">{lab.LAB_PAT_TESTS || 'Standard Diagnostic Specimen Panel'}</p>
                    </div>

                    {lab.LAB_PAT_RESULTS ? (
                      <div className="p-3 rounded-lg bg-kpi-success-subtle border border-border">
                        <span className="font-semibold text-kpi-success text-xs block mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pathology Findings & Results:
                        </span>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{lab.LAB_PAT_RESULTS}</p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-card/50 border border-border text-xs text-muted flex items-center gap-2">
                        <Clock className="w-4 h-4 text-kpi-warning" />
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
