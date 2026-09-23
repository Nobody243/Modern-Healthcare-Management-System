'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, ArrowLeftRight, CheckCircle2, Clock, Activity, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import PatientTransfersForm from './patient-transfers-form';
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
  PT_STATUS: string;
}

export default function PatientTransfersClient() {
  const safeDelete = useSafeDelete();
  const [transfers, setTransfers] = useState<PatientTransfer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<PatientTransfer | null>(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async (skipCache = false) => {
    try {
      if (transfers.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/patient-transfers');
      }
      const data = await fetchWithCache<PatientTransfer[]>('/api/patient-transfers');
      setTransfers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      if (transfers.length === 0) {
        toast.error('Failed to load patient transfers');
        setTransfers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  function handleDelete(transfer: PatientTransfer) {
    safeDelete.requestDelete({
      url: `/api/patient-transfers?id=${transfer.PT_ID}`,
      itemType: 'Patient Transfer',
      itemTitle: `${transfer.PT_PAT_NAME || 'Transfer'} (${transfer.PT_FROM_WARD} → ${transfer.PT_TO_WARD})`,
      successMessage: 'Patient transfer record deleted successfully',
      onSuccess: () => fetchTransfers(true),
    });
  }

  const handleEdit = (transfer: PatientTransfer) => {
    setEditingTransfer(transfer);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingTransfer(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransfer(null);
  };

  const handleSuccess = () => {
    fetchTransfers(true);
    handleCloseForm();
  };

  const filteredTransfers = useMemo(() => {
    return transfers.filter((transfer) =>
      `${transfer.PT_PAT_NAME || ''} ${transfer.PT_PAT_NUMBER || ''} ${transfer.PT_FROM_WARD || ''} ${transfer.PT_TO_WARD || ''} ${transfer.PT_STATUS || ''} ${transfer.PT_REASON || ''} ${transfer.PT_AUTHORIZED_BY || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1"
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-heading tracking-tight">
                Patient Transfers
              </h1>
              <span className="badge-counter">
                {transfers.length} Transfers
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Coordinate inter-ward, ICU step-down, and department transfers
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={handleAddNew}
              className="btn-primary flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Initiate Transfer</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Transfer Orders</p>
                <p className="text-2xl font-bold text-heading mt-1">{transfers.length}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-primary shadow-sm">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Completed Transfers</p>
                <p className="text-2xl font-bold text-heading mt-1">{completedCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-success shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">In Transit / Progress</p>
                <p className="text-2xl font-bold text-heading mt-1">{inProgressCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-info shadow-sm">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Pending Approvals</p>
                <p className="text-2xl font-bold text-heading mt-1">{pendingCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-warning shadow-sm">
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
          <Card className="card-glass p-4 border border-border/70 shadow-md backdrop-blur-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                placeholder="Search transfers by patient name, patient number, ward route, or authorizing doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-hospital pl-10 h-11"
              />
            </div>
          </Card>
        </motion.div>

        {/* Table View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card overflow-hidden border border-border/70 shadow-xl bg-card/60 backdrop-blur-xl relative">
            <div className="card-accent-bar" />
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-body font-medium">Loading patient transfers...</p>
              </div>
            ) : filteredTransfers.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-muted text-muted-foreground border border-border">
                  <ArrowLeftRight className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No transfers found</p>
                <p className="text-muted text-sm">Try adjusting your search query or create a new patient transfer</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> New Transfer
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-28">Patient No.</th>
                      <th className="w-52">Patient Name</th>
                      <th className="w-64">Transfer Route</th>
                      <th>Reason for Transfer</th>
                      <th className="w-44">Authorized By</th>
                      <th className="w-32">Date</th>
                      <th className="w-32">Status</th>
                      <th className="text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredTransfers.map((transfer, index) => (
                        <motion.tr
                          key={transfer.PT_ID}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <td className="table-id-link">
                            {transfer.PT_PAT_NUMBER || `PAT-${transfer.PT_ID}`}
                          </td>
                          <td className="font-semibold text-heading">
                            {transfer.PT_PAT_NAME || 'Patient'}
                          </td>
                          <td>
                            <div className="flex items-center gap-1.5 text-xs font-medium">
                              <span className="px-2 py-0.5 rounded bg-card text-foreground border border-border">
                                {transfer.PT_FROM_WARD || 'Ward A'}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="px-2 py-0.5 rounded bg-kpi-primary-subtle text-kpi-primary border">
                                {transfer.PT_TO_WARD || 'Ward B'}
                              </span>
                            </div>
                          </td>
                          <td className="text-muted text-sm max-w-xs truncate">
                            {transfer.PT_REASON || 'Clinical requirement'}
                          </td>
                          <td className="text-body text-sm">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                              <UserCheck className="w-3.5 h-3.5 text-primary" />
                              <span>{transfer.PT_AUTHORIZED_BY || 'Attending Physician'}</span>
                            </div>
                          </td>
                          <td className="text-muted text-xs">
                            {formatDate(transfer.PT_TRANSFER_DATE)}
                          </td>
                          <td>
                            <StatusBadge status={transfer.PT_STATUS || 'Pending'} showIcon />
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(transfer)}
                                className="table-action-edit hover-lift cursor-pointer"
                                title="Edit Transfer"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(transfer)}
                                disabled={safeDelete.isDeleting}
                                className="table-action-delete hover-lift cursor-pointer"
                                title="Delete Transfer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && (
          <PatientTransfersForm
            transfer={editingTransfer}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
