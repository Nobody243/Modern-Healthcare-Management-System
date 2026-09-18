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
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
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
              className="btn-primary flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Write Prescription</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Prescriptions Authored</p>
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
                <p className="text-xs text-muted font-medium">Active Regimens</p>
                <p className="text-2xl font-bold text-heading mt-1">{activeCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Completed Courses</p>
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
                <p className="text-xs text-muted font-medium">Refills Remaining</p>
                <p className="text-2xl font-bold text-heading mt-1">{totalRefills}</p>
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
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <Card className="card p-12 text-center border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mx-auto mb-4 flex items-center justify-center text-cyan-400">
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
                  <Card className="card overflow-hidden border border-slate-700/50 hover:border-cyan-500/40 transition-all bg-slate-900/60 backdrop-blur-xl shadow-lg hover:shadow-cyan-500/5">
                    <div className="h-1 bg-gradient-to-r from-sky-500 via-teal-500 to-cyan-500" />
                    <CardHeader className="flex flex-row items-start justify-between pb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-heading">
                            {prescription.PRES_MEDICATION}
                          </CardTitle>
                          <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                            <User className="w-3 h-3 text-cyan-400" />
                            <span className="font-medium text-slate-300">{prescription.PRES_PAT_NAME}</span>
                            <span className="font-mono text-muted">({prescription.PRES_PAT_NUMBER})</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge className={`badge ${getStatusBadge(prescription.PRES_STATUS)}`}>
                          {prescription.PRES_STATUS || 'Active'}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(prescription)}
                          className="hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all hover-lift cursor-pointer h-8 w-8"
                          title="Edit Prescription"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(prescription)}
                          disabled={safeDelete.isDeleting}
                          className="hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all hover-lift cursor-pointer h-8 w-8"
                          title="Delete Prescription"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                        <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                          <span className="text-muted block text-[10px] uppercase font-semibold">Dosage</span>
                          <span className="font-medium text-heading mt-0.5 block">{prescription.PRES_DOSAGE || 'Standard'}</span>
                        </div>
                        <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                          <span className="text-muted block text-[10px] uppercase font-semibold">Frequency</span>
                          <span className="font-medium text-heading mt-0.5 block truncate">{prescription.PRES_FREQUENCY || 'Once daily'}</span>
                        </div>
                        <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                          <span className="text-muted block text-[10px] uppercase font-semibold">Duration</span>
                          <span className="font-medium text-heading mt-0.5 block">{prescription.PRES_DURATION || '7 Days'}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-slate-800">
                        <span>Rx No: <span className="font-mono text-cyan-400 font-medium">{prescription.PRES_NUMBER}</span></span>
                        <span>Refills: <span className="font-mono font-semibold text-amber-400">{prescription.PRES_REFILLS_REMAINING || 0}</span></span>
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
