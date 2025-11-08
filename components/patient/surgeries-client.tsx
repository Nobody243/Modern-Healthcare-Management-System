'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Calendar, Search, CheckCircle2, Stethoscope, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
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
            <span className="badge-counter">
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
        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Total OT Procedures</p>
              <p className="text-2xl font-bold text-heading mt-1">{surgeries.length}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-primary">
              <Scissors className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Completed Surgeries</p>
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
              <p className="text-xs text-muted font-medium">Scheduled OT Dates</p>
              <p className="text-2xl font-bold text-heading mt-1">{scheduledCount}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-info">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">In Theater / Active</p>
              <p className="text-2xl font-bold text-heading mt-1">{inProgressCount}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-warning">
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
        <Card className="card-glass p-4 border border-border shadow-md">
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
        <Card className="card p-12 text-center border border-border">
          <div className="w-16 h-16 rounded-2xl kpi-icon-primary mx-auto mb-4 flex items-center justify-center">
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
                <Card className="card overflow-hidden border border-border hover:border-muted-foreground/30 transition-all shadow-md">
                  <div className="card-accent-bar" />
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl kpi-icon-primary shrink-0">
                          <Scissors className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-heading">
                            {surgery.SURG_TYPE || 'Surgical Procedure'}
                          </CardTitle>
                          <p className="text-xs text-muted mt-0.5 flex items-center gap-2">
                            <span className="table-id-link">#{surgery.SURG_NUMBER}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-foreground">
                              <Stethoscope className="w-3 h-3 text-primary" />
                              Lead: {surgery.SURG_DOC_NAME || 'Surgical Specialist'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={surgery.SURG_STATUS || 'Scheduled'} showIcon />
                        <span className="text-xs text-muted font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {formatDate(surgery.SURG_DATE)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                      <div className="p-2.5 rounded-lg bg-card border border-border">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Procedure Date</span>
                        <span className="text-sm font-semibold text-heading mt-0.5 block">{formatDate(surgery.SURG_DATE)}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-card border border-border">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Duration</span>
                        <span className="text-sm font-semibold text-heading mt-0.5 block">{surgery.SURG_DURATION || '—'}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-card border border-border">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Lead Surgeon</span>
                        <span className="text-sm font-semibold text-heading mt-0.5 block truncate">{surgery.SURG_DOC_NAME || 'Staff Surgeon'}</span>
                      </div>
                    </div>
                    {surgery.SURG_NOTES && (
                      <div className="p-2.5 rounded-lg bg-card/50 border border-border text-xs text-muted">
                        <span className="font-semibold text-foreground block mb-0.5">Operative & Recovery Notes:</span>
                        <p className="line-clamp-2">{surgery.SURG_NOTES}</p>
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
