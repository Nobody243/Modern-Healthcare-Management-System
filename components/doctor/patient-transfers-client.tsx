'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { ArrowLeftRight, Loader2, Plus, Edit, Trash2, Search, CheckCircle2, Clock, Activity, ArrowRight, User } from 'lucide-react';
import { PatientTransferForm } from './patient-transfers-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';

interface PatientTransfer {
  PT_ID: number;
  PT_PAT_NUMBER: string;
  PT_PAT_NAME: string;
  PT_FROM_WARD: string;
  PT_TO_WARD: string;
  PT_REASON: string;
  PT_TRANSFER_DATE: string;
  PT_AUTHORIZED_BY: string;
  PT_AUTHORIZED_DOC_NAME?: string;
  PT_STATUS: string;
  PAT_FNAME?: string;
  PAT_LNAME?: string;
}

export default function DoctorPatientTransfersClient() {
  const safeDelete = useSafeDelete();
  const searchParams = useSearchParams();
  const [transfers, setTransfers] = useState<PatientTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorName, setDoctorName] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<PatientTransfer | undefined>();

  useEffect(() => {
    fetchTransfers();
    if (searchParams.get('action') === 'add') {
      setFormOpen(true);
    }
  }, [searchParams]);

  const fetchTransfers = async (skipCache = false) => {
    try {
      if (transfers.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/patient-transfers');
        invalidateApiCache('/api/doctors');
      }
      const doctor = await fetchWithCache<any>('/api/doctors/me');
      setDoctorName(`${doctor.DOC_FNAME} ${doctor.DOC_LNAME}`);

      const data = await fetchWithCache<PatientTransfer[]>(`/api/doctors/${doctor.DOC_NUMBER}/patient-transfers`);
      setTransfers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching patient transfers:', error);
      if (transfers.length === 0) {
        toast.error('Failed to load patient transfers');
        setTransfers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transfer: PatientTransfer) => {
    setEditingTransfer(transfer);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingTransfer(undefined);
    setFormOpen(true);
  };

  function handleDelete(transfer: PatientTransfer) {
    safeDelete.requestDelete({
      url: `/api/patient-transfers?id=${transfer.PT_ID}`,
      itemType: 'Patient Transfer',
      itemTitle: `${transfer.PT_PAT_NAME || 'Transfer'} (${transfer.PT_FROM_WARD} → ${transfer.PT_TO_WARD})`,
      successMessage: 'Transfer deleted successfully',
      onSuccess: () => fetchTransfers(true),
    });
  }

  const handleFormSuccess = () => {
    fetchTransfers(true);
    setEditingTransfer(undefined);
  };

  const filteredTransfers = useMemo(() => {
    return transfers.filter((transfer) => {
      const patientName = transfer.PT_PAT_NAME || `${transfer.PAT_FNAME || ''} ${transfer.PAT_LNAME || ''}`;
      return `${patientName} ${transfer.PT_PAT_NUMBER || ''} ${transfer.PT_FROM_WARD || ''} ${transfer.PT_TO_WARD || ''} ${transfer.PT_STATUS || ''} ${transfer.PT_REASON || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [transfers, searchTerm]);

  // Dynamic KPI Stats
  const completedCount = useMemo(() => {
    return transfers.filter((t) => t.PT_STATUS?.toLowerCase().includes('complete')).length;
  }, [transfers]);

  const inProgressCount = useMemo(() => {
    return transfers.filter((t) => t.PT_STATUS?.toLowerCase().includes('progress')).length;
  }, [transfers]);

  const pendingCount = useMemo(() => {
    return transfers.filter((t) => t.PT_STATUS?.toLowerCase().includes('pending')).length;
  }, [transfers]);

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('complete')) return 'badge-success';
    if (s.includes('progress')) return 'badge-info';
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
                Patient Transfers & Relocations
              </h1>
              <span className="badge-counter">
                {transfers.length} Transfers
              </span>
            </div>
            <p className="text-muted mt-1">
              Authorize ward changes, intensive care escalations, and cross-departmental patient handoffs
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
              <span>Initiate Transfer</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Transfers</p>
                <p className="text-2xl font-bold text-heading mt-1">{transfers.length}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-primary">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Completed Relocations</p>
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
                <p className="text-xs text-muted font-medium">In Transit / Progress</p>
                <p className="text-2xl font-bold text-heading mt-1">{inProgressCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-info">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Pending Orders</p>
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
                placeholder="Search transfers by patient name, patient number, source/destination ward, or reason..."
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
        ) : filteredTransfers.length === 0 ? (
          <Card className="card p-12 text-center border border-border">
            <div className="w-16 h-16 rounded-2xl kpi-icon-primary mx-auto mb-4 flex items-center justify-center">
              <ArrowLeftRight className="w-8 h-8" />
            </div>
            <p className="text-heading font-semibold text-lg">No patient transfers found</p>
            <p className="text-muted text-sm mt-1">Try adjusting your search query or initiate a new transfer</p>
            <Button onClick={handleAddNew} className="btn-primary mt-4">
              <Plus className="w-4 h-4 mr-1.5" /> Initiate First Transfer
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredTransfers.map((transfer, index) => {
                const patientName = transfer.PT_PAT_NAME || `${transfer.PAT_FNAME || ''} ${transfer.PAT_LNAME || ''}`.trim() || 'Patient';
                return (
                  <motion.div
                    key={transfer.PT_ID}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Card className="card overflow-hidden border border-border shadow-lg">
                      <div className="card-accent-bar" />
                      <CardHeader className="flex flex-row items-start justify-between pb-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-xl kpi-icon-primary shrink-0">
                            <ArrowLeftRight className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-heading">
                              {patientName}
                            </CardTitle>
                            <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                              <span className="table-id-link">{transfer.PT_PAT_NUMBER}</span>
                              <span>•</span>
                              <span>{formatDate(transfer.PT_TRANSFER_DATE)}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={transfer.PT_STATUS || 'Pending'} showIcon />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(transfer)}
                            className="table-action-edit hover-lift cursor-pointer h-8 w-8"
                            title="Edit Transfer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(transfer)}
                            disabled={safeDelete.isDeleting}
                            className="table-action-delete hover-lift cursor-pointer h-8 w-8"
                            title="Delete Transfer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="p-3 rounded-lg bg-card border border-border mb-3">
                          <span className="text-muted block text-[10px] uppercase font-semibold mb-1">Ward Route</span>
                          <div className="flex items-center gap-2 text-xs font-medium">
                            <span className="px-2.5 py-1 rounded bg-card text-foreground border border-border">
                              {transfer.PT_FROM_WARD || 'Origin Ward'}
                            </span>
                            <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                            <span className="badge-theme-primary px-2.5 py-1 rounded">
                              {transfer.PT_TO_WARD || 'Destination Ward'}
                            </span>
                          </div>
                        </div>
                        {transfer.PT_REASON && (
                          <div className="p-2.5 rounded-lg bg-card/50 border border-border text-xs text-muted">
                            <span className="font-semibold text-foreground block mb-0.5">Clinical Justification:</span>
                            <p className="line-clamp-2">{transfer.PT_REASON}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {formOpen && (
        <PatientTransferForm
          transfer={editingTransfer}
          onClose={() => {
            setFormOpen(false);
            setEditingTransfer(undefined);
          }}
          onSuccess={handleFormSuccess}
          doctorName={doctorName}
        />
      )}

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
