'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Scissors, CheckCircle2, Clock, Activity, Calendar, Stethoscope, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import SurgeryForm, { Surgery } from './surgery-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';
import { StatusBadge } from '@/components/ui/status-badge';

export default function SurgeryClient() {
  const safeDelete = useSafeDelete();
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSurgery, setEditingSurgery] = useState<Surgery | null>(null);

  useEffect(() => {
    fetchSurgeries();
  }, []);

  const fetchSurgeries = async (skipCache = false) => {
    try {
      if (surgeries.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/surgery');
      }
      const data = await fetchWithCache<Surgery[]>('/api/surgery');
      setSurgeries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching surgeries:', error);
      if (surgeries.length === 0) {
        toast.error('Failed to load surgeries');
        setSurgeries([]);
      }
    } finally {
      setLoading(false);
    }
  };

  function handleDelete(surgery: Surgery) {
    safeDelete.requestDelete({
      url: `/api/surgery?id=${surgery.SURG_ID}`,
      itemType: 'Surgery Record',
      itemTitle: surgery.SURG_NUMBER || `Surgery #${surgery.SURG_ID}`,
      successMessage: 'Surgery record deleted successfully',
      onSuccess: () => fetchSurgeries(true),
    });
  }

  const handleEdit = (surgery: Surgery) => {
    setEditingSurgery(surgery);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingSurgery(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSurgery(null);
  };

  const handleSuccess = () => {
    fetchSurgeries(true);
    handleCloseForm();
  };

  const filteredSurgeries = useMemo(() => {
    return surgeries.filter((surgery) =>
      `${surgery.SURG_PAT_NAME || ''} ${surgery.SURG_PAT_NUMBER || ''} ${surgery.SURG_DOC_NAME || ''} ${surgery.SURG_NUMBER || ''} ${surgery.SURG_TYPE || ''} ${surgery.SURG_STATUS || ''}`
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
                Surgical Operations
              </h1>
              <span className="badge-counter">
                {surgeries.length} Procedures
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              OT bookings, lead surgeon allocations, operative types, and post-op recovery
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
              <span>Schedule Surgery</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total OT Bookings</p>
                <p className="text-2xl font-bold text-heading mt-1">{surgeries.length}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-primary shadow-sm">
                <Scissors className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Successfully Completed</p>
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
                <p className="text-xs text-muted font-medium">Scheduled / Upcoming</p>
                <p className="text-2xl font-bold text-heading mt-1">{scheduledCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-info shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">In Theater / Active</p>
                <p className="text-2xl font-bold text-heading mt-1">{inProgressCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-warning shadow-sm">
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
          <Card className="card-glass p-4 border border-border/70 shadow-md backdrop-blur-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                placeholder="Search surgeries by procedure name, surgeon, patient name, or code..."
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
                <p className="text-body font-medium">Loading surgical records...</p>
              </div>
            ) : filteredSurgeries.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-muted text-muted border border-border">
                  <Scissors className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No surgeries found</p>
                <p className="text-muted text-sm">Try adjusting your search query or schedule a new procedure</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> Schedule Surgery
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-32">Surgery No.</th>
                      <th className="w-52">Patient</th>
                      <th className="w-48">Lead Surgeon</th>
                      <th className="w-56">Procedure Type</th>
                      <th className="w-32">Date</th>
                      <th className="w-32">Status</th>
                      <th className="text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredSurgeries.map((surgery, index) => (
                        <motion.tr
                          key={surgery.SURG_ID}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <td className="table-id-link">
                            {surgery.SURG_NUMBER || `SURG-${surgery.SURG_ID}`}
                          </td>
                          <td className="font-semibold text-heading">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-primary shrink-0" />
                              <div>
                                <div>{surgery.SURG_PAT_NAME || 'Patient'}</div>
                                <div className="text-xs font-mono text-muted font-normal">{surgery.SURG_PAT_NUMBER}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-body text-sm font-medium">
                            <div className="flex items-center gap-1.5 text-xs text-foreground">
                              <Stethoscope className="w-3.5 h-3.5 text-primary" />
                              <span>Dr. {surgery.SURG_DOC_NAME || 'Surgeon'}</span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-1.5 font-medium text-heading">
                              <Scissors className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>{surgery.SURG_TYPE || 'General Surgical Procedure'}</span>
                            </div>
                          </td>
                          <td className="text-muted text-xs">
                            {formatDate(surgery.SURG_DATE)}
                          </td>
                          <td>
                            <StatusBadge status={surgery.SURG_STATUS || 'Scheduled'} showIcon />
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(surgery)}
                                className="table-action-edit hover-lift cursor-pointer"
                                title="Edit Surgery"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(surgery)}
                                disabled={safeDelete.isDeleting}
                                className="table-action-delete hover-lift cursor-pointer"
                                title="Delete Surgery"
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
          <SurgeryForm
            surgery={editingSurgery}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
