'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, Pill, Search, CheckCircle2, Clock, RotateCcw, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
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
              My Prescriptions & Medications
            </h1>
            <span className="badge-counter">
              {prescriptions.length} Prescriptions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Active physician medication orders, dosage schedules, and refill history
          </p>
        </motion.div>
      </div>

      {/* Bento KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Total Prescriptions</p>
              <p className="text-2xl font-bold text-heading mt-1">{prescriptions.length}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-primary">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Active Medications</p>
              <p className="text-2xl font-bold text-heading mt-1">{activeCount}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-success">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Completed Regimens</p>
              <p className="text-2xl font-bold text-heading mt-1">{completedCount}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-info">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Available Refills</p>
              <p className="text-2xl font-bold text-heading mt-1">{totalRefills}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-warning">
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
        <Card className="card-glass p-4 border border-border shadow-md">
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
        <Card className="card p-12 text-center border border-border">
          <div className="w-16 h-16 rounded-2xl kpi-icon-primary mx-auto mb-4 flex items-center justify-center">
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
                <Card className="card overflow-hidden border border-border hover:border-muted-foreground/30 transition-all shadow-md">
                  <div className="card-accent-bar" />
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl kpi-icon-primary shrink-0">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-heading">
                            {prescription.PRES_MEDICATION}
                          </CardTitle>
                          <p className="text-xs text-muted mt-0.5 flex items-center gap-2">
                            <span className="table-id-link">Rx #{prescription.PRES_NUMBER}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-foreground">
                              <Stethoscope className="w-3 h-3 text-primary" />
                              {prescription.PRES_DOC_NAME || 'Attending Physician'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={prescription.PRES_STATUS || 'Active'} showIcon />
                        <span className="text-xs text-muted font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {formatDate(prescription.PRES_DATE)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      <div className="p-2.5 rounded-lg bg-card border border-border">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Dosage</span>
                        <span className="text-sm font-semibold text-heading mt-0.5 block">{prescription.PRES_DOSAGE || 'Standard'}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-card border border-border">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Frequency</span>
                        <span className="text-sm font-semibold text-heading mt-0.5 block">{prescription.PRES_FREQUENCY || 'Once Daily'}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-card border border-border">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Duration</span>
                        <span className="text-sm font-semibold text-heading mt-0.5 block">{prescription.PRES_DURATION || '7 Days'}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-card border border-border">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Refills Left</span>
                        <span className="text-sm font-bold font-mono text-kpi-warning mt-0.5 block">{prescription.PRES_REFILLS_REMAINING || 0}</span>
                      </div>
                    </div>
                    {prescription.PRES_NOTES && (
                      <div className="p-2.5 rounded-lg bg-card/50 border border-border text-xs text-muted">
                        <span className="font-semibold text-foreground block mb-0.5">Doctor Instructions:</span>
                        <p className="line-clamp-2">{prescription.PRES_NOTES}</p>
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
