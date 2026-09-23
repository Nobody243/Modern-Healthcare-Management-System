'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, FileText, ClipboardList, User, Users, Calendar, Pill, ShieldCheck, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { fetchWithCache } from '@/lib/api-cache';

interface MedicalRecord {
  MDR_ID: number;
  MDR_NUMBER: string;
  MDR_PAT_NUMBER: string;
  MDR_PAT_NAME: string;
  MDR_PAT_AGE: string;
  MDR_PAT_ADR: string;
  MDR_PAT_AILMENT: string;
  MDR_PAT_PRESCR: string;
  MDR_DOC_NUMBER?: string;
  MDR_DIAGNOSIS?: string;
  MDR_TREATMENT_PLAN?: string;
  MDR_DATE_REC: string;
  IS_OWN_RECORD?: 'Y' | 'N';
}

interface RecordsClientProps {
  doctorId: string;
}

export default function RecordsClient({ doctorId }: RecordsClientProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    try {
      if (records.length === 0) setLoading(true);
      const data = await fetchWithCache<MedicalRecord[]>(`/api/doctors/${doctorId}/records`);
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      if (records.length === 0) {
        toast.error('Failed to load medical records');
        setRecords([]);
      }
    } finally {
      setLoading(false);
    }
  }, [doctorId, records.length]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) =>
      `${record.MDR_PAT_NAME || ''} ${record.MDR_PAT_NUMBER || ''} ${record.MDR_NUMBER || ''} ${record.MDR_PAT_AILMENT || ''} ${record.MDR_PAT_PRESCR || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  // Dynamic KPI Stats
  const ownRecordsCount = useMemo(() => {
    return records.filter((r) => r.IS_OWN_RECORD === 'Y').length;
  }, [records]);

  const historicalRecordsCount = useMemo(() => {
    return records.filter((r) => r.IS_OWN_RECORD === 'N').length;
  }, [records]);

  const uniquePatients = useMemo(() => {
    const set = new Set(records.map((r) => r.MDR_PAT_NUMBER).filter(Boolean));
    return set.size;
  }, [records]);

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
              Patient Medical Records
            </h1>
            <span className="badge-counter">
              {records.length} Charts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Patient health histories, prior clinician evaluations, and longitudinal charts
          </p>
        </motion.div>
      </div>

      {/* Bento KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Total Accessible Charts</p>
              <p className="text-2xl font-bold text-heading mt-1">{records.length}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-primary">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Authored by You</p>
              <p className="text-2xl font-bold text-heading mt-1">{ownRecordsCount}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-success">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Historical Case Files</p>
              <p className="text-2xl font-bold text-heading mt-1">{historicalRecordsCount}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-info">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted font-medium">Distinct Patients</p>
              <p className="text-2xl font-bold text-heading mt-1">{uniquePatients}</p>
            </div>
            <div className="p-2.5 rounded-xl kpi-icon-warning">
              <Users className="w-5 h-5" />
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
              placeholder="Search medical records by patient name, patient number, record number, or diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-hospital pl-10 h-11"
            />
          </div>
        </Card>
      </motion.div>

      {/* Card Grid View */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 animate-spin text-[rgb(var(--primary))]" />
        </div>
      ) : filteredRecords.length === 0 ? (
        <Card className="card p-12 text-center border border-border">
          <div className="w-16 h-16 rounded-2xl kpi-icon-primary mx-auto mb-4 flex items-center justify-center">
            <FileText className="w-8 h-8" />
          </div>
          <p className="text-heading font-semibold text-lg">No medical records found</p>
          <p className="text-muted text-sm mt-1">Try adjusting your search query</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredRecords.map((record, index) => (
              <motion.div
                key={record.MDR_ID}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.04 }}
              >
                <Card className="card overflow-hidden border border-border hover:border-muted-foreground/30 transition-all shadow-md">
                  <div className="card-accent-bar" />
                  <CardHeader className="flex flex-row items-start justify-between pb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl kpi-icon-primary shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-heading">
                          {record.MDR_PAT_NAME}
                        </CardTitle>
                        <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                          <span className="table-id-link">{record.MDR_PAT_NUMBER}</span>
                          <span>•</span>
                          <span className="font-mono text-muted">{record.MDR_NUMBER}</span>
                        </p>
                      </div>
                    </div>
                    {record.IS_OWN_RECORD === 'Y' ? (
                      <Badge className="badge badge-success">
                        Your Record
                      </Badge>
                    ) : (
                      <Badge className="badge badge-purple">
                        Historical Chart
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="bg-card p-2.5 rounded-lg border border-border">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Date of Record</span>
                        <span className="font-medium text-heading mt-0.5 block">{formatDate(record.MDR_DATE_REC)}</span>
                      </div>
                      <div className="bg-card p-2.5 rounded-lg border border-border">
                        <span className="text-muted block text-[10px] uppercase font-semibold">Age / Demographics</span>
                        <span className="font-medium text-heading mt-0.5 block">{record.MDR_PAT_AGE ? `${record.MDR_PAT_AGE} yrs` : '—'}</span>
                      </div>
                    </div>
                    {record.MDR_PAT_AILMENT && (
                      <div className="p-2.5 rounded-lg bg-card/50 border border-border text-xs mb-2">
                        <span className="font-semibold text-foreground block mb-0.5">Clinical Diagnosis:</span>
                        <p className="text-muted line-clamp-2">{record.MDR_PAT_AILMENT}</p>
                      </div>
                    )}
                    {record.MDR_PAT_PRESCR && (
                      <div className="p-2.5 rounded-lg bg-kpi-primary-subtle border border-primary/20 text-xs">
                        <span className="font-semibold text-primary block mb-0.5 flex items-center gap-1">
                          <Pill className="w-3 h-3" /> Prescribed Regimen:
                        </span>
                        <p className="text-foreground line-clamp-2">{record.MDR_PAT_PRESCR}</p>
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
