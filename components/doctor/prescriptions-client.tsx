'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2, Plus, Edit, Trash2, Search, Pill, CheckCircle2, Clock, RotateCcw, User } from 'lucide-react';
import { toast } from 'sonner';
import { PrescriptionForm } from './prescription-form';
import { formatDate } from '@/lib/utils';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';
import { StatusBadge } from '@/components/ui/status-badge';

interface Prescription {
  PRES_ID: number;
  PRES_NUMBER: string;
  PRES_PAT_NUMBER: string;
  PRES_PAT_NAME?: string;
  PAT_FNAME?: string;
  PAT_LNAME?: string;
  PRES_DOC_NUMBER?: string;
  PRES_DOC_NAME?: string;
  PRES_MEDICATION: string;
  PRES_DOSAGE: string;
  PRES_FREQUENCY: string;
  PRES_DURATION: string;
  PRES_DATE: string;
  PRES_STATUS: string;
  PRES_REFILLS_REMAINING?: number;
  PRES_NOTES?: string;
}

export default function DoctorPrescriptionsClient() {
  const safeDelete = useSafeDelete();
  const searchParams = useSearchParams();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorNumber, setDoctorNumber] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | undefined>();

  useEffect(() => {
    fetchPrescriptions();
    if (searchParams.get('action') === 'add') {
      setFormOpen(true);
    }
  }, [searchParams]);

  const fetchPrescriptions = async (skipCache = false) => {
    try {
      if (prescriptions.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/prescriptions');
        invalidateApiCache('/api/doctors');
      }
      const doctor = await fetchWithCache<any>('/api/doctors/me');
      setDoctorNumber(doctor.DOC_NUMBER);

      const data = await fetchWithCache<Prescription[]>(`/api/doctors/${doctor.DOC_NUMBER}/prescriptions`);
      setPrescriptions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      if (prescriptions.length === 0) {
        toast.error('Failed to load prescriptions');
        setPrescriptions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingPrescription(undefined);
    setFormOpen(true);
  };

  function handleDelete(prescription: Prescription) {
    safeDelete.requestDelete({
      url: `/api/prescriptions?id=${prescription.PRES_ID}`,
      itemType: 'Prescription',
      itemTitle: prescription.PRES_NUMBER || `Prescription #${prescription.PRES_ID}`,
      successMessage: 'Prescription deleted successfully',
      onSuccess: () => fetchPrescriptions(true),
    });
  }

  const handleFormSuccess = () => {
    fetchPrescriptions(true);
    setEditingPrescription(undefined);
  };

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((prescription) =>
      `${prescription.PRES_PAT_NAME || ''} ${prescription.PRES_PAT_NUMBER || ''} ${prescription.PRES_NUMBER || ''} ${prescription.PRES_MEDICATION || ''} ${prescription.PRES_STATUS || ''}`
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
                My Prescriptions
              </h1>
              <span className="badge-counter">
                {prescriptions.length} Issued
              </span>
            </div>
            <p className="text-muted mt-1">
              Authored pharmaceutical regimens, dosage frequencies, course durations, and refills
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
              <span>Write Prescription</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Prescriptions Authored</p>
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
                <p className="text-xs text-muted font-medium">Active Regimens</p>
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
                <p className="text-xs text-muted font-medium">Completed Courses</p>
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
                <p className="text-xs text-muted font-medium">Refills Remaining</p>
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
                placeholder="Search prescriptions by patient name, prescription number, or medication..."
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
            <Loader2 className="w-10 h-10 animate-spin text-[rgb(var(--primary))]" />
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <Card className="card p-12 text-center border border-border">
            <div className="w-16 h-16 rounded-2xl kpi-icon-primary mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8" />
            </div>
            <p className="text-heading font-semibold text-lg">No prescriptions issued</p>
            <p className="text-muted text-sm mt-1">Try adjusting your search query or write a new prescription</p>
            <Button onClick={handleAddNew} className="btn-primary mt-4">
              <Plus className="w-4 h-4 mr-1.5" /> Write First Prescription
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredPrescriptions.map((prescription, index) => (
                <motion.div
                  key={prescription.PRES_ID}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Card className="card overflow-hidden border border-border hover:border-border/80 transition-all bg-card shadow-lg">
                    <div className="card-accent-bar" />
                    <CardHeader className="flex flex-row items-start justify-between pb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl kpi-icon-primary shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-heading">
                            {prescription.PRES_MEDICATION}
                          </CardTitle>
                          <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                            <User className="w-3 h-3 text-primary" />
                            <span className="font-medium text-foreground">{prescription.PRES_PAT_NAME}</span>
                            <span className="table-id-link">({prescription.PRES_PAT_NUMBER})</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={prescription.PRES_STATUS || 'Active'} showIcon />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(prescription)}
                          className="table-action-edit hover-lift cursor-pointer h-8 w-8"
                          title="Edit Prescription"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(prescription)}
                          disabled={safeDelete.isDeleting}
                          className="table-action-delete hover-lift cursor-pointer h-8 w-8"
                          title="Delete Prescription"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                        <div className="bg-card p-2.5 rounded-lg border border-border">
                          <span className="text-muted block text-[10px] uppercase font-semibold">Dosage</span>
                          <span className="font-medium text-heading mt-0.5 block">{prescription.PRES_DOSAGE || 'Standard'}</span>
                        </div>
                        <div className="bg-card p-2.5 rounded-lg border border-border">
                          <span className="text-muted block text-[10px] uppercase font-semibold">Frequency</span>
                          <span className="font-medium text-heading mt-0.5 block truncate">{prescription.PRES_FREQUENCY || 'Once daily'}</span>
                        </div>
                        <div className="bg-card p-2.5 rounded-lg border border-border">
                          <span className="text-muted block text-[10px] uppercase font-semibold">Duration</span>
                          <span className="font-medium text-heading mt-0.5 block">{prescription.PRES_DURATION || '7 Days'}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-border">
                        <span>Rx No: <span className="table-id-link">{prescription.PRES_NUMBER}</span></span>
                        <span>Refills: <span className="font-mono font-semibold text-kpi-warning">{prescription.PRES_REFILLS_REMAINING || 0}</span></span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <PrescriptionForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingPrescription(undefined);
        }}
        onSuccess={handleFormSuccess}
        prescription={editingPrescription}
        doctorNumber={doctorNumber}
      />

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
