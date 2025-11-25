'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Syringe, Loader2, Plus, Edit, Trash2, Search, CheckCircle2, Calendar, Clock, Activity, Scissors, User } from 'lucide-react';
import { toast } from 'sonner';
import { SurgeryForm } from './surgery-form';
import { formatDate } from '@/lib/utils';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';
import { StatusBadge } from '@/components/ui/status-badge';

interface Surgery {
  SURG_ID: number;
  SURG_NUMBER: string;
  SURG_PAT_NAME: string;
  SURG_PAT_NUMBER: string;
  SURG_DOC_NUMBER: string;
  SURG_DOC_NAME: string;
  SURG_TYPE: string;
  SURG_DATE: string;
  SURG_DURATION: string;
  SURG_STATUS: string;
  SURG_NOTES: string;
  PAT_FNAME?: string;
  PAT_LNAME?: string;
  PAT_NUMBER?: string;
}

export default function DoctorSurgeriesClient() {
  const safeDelete = useSafeDelete();
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorNumber, setDoctorNumber] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingSurgery, setEditingSurgery] = useState<Surgery | undefined>();

  useEffect(() => {
    fetchSurgeries();
  }, []);

  const fetchSurgeries = async (skipCache = false) => {
    try {
      if (surgeries.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/surgery');
        invalidateApiCache('/api/doctors');
      }
      const doctor = await fetchWithCache<any>('/api/doctors/me');
      setDoctorNumber(doctor.DOC_NUMBER);

      const data = await fetchWithCache<Surgery[]>(`/api/doctors/${doctor.DOC_NUMBER}/surgeries`);
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

  const handleEdit = (surgery: Surgery) => {
    setEditingSurgery(surgery);
    setFormOpen(true);
  };

  function handleDelete(surgery: Surgery) {
    safeDelete.requestDelete({
      url: `/api/surgery?id=${surgery.SURG_ID}`,
      itemType: 'Surgery',
      itemTitle: surgery.SURG_NUMBER || `Surgery #${surgery.SURG_ID}`,
      successMessage: 'Surgery deleted successfully',
      onSuccess: () => fetchSurgeries(true),
    });
  }

  const handleAddNew = () => {
    setEditingSurgery(undefined);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    fetchSurgeries(true);
    setEditingSurgery(undefined);
  };

  const filteredSurgeries = useMemo(() => {
    return surgeries.filter((surgery) => {
      const patientName = surgery.SURG_PAT_NAME || `${surgery.PAT_FNAME || ''} ${surgery.PAT_LNAME || ''}`;
      return `${patientName} ${surgery.SURG_NUMBER || ''} ${surgery.SURG_TYPE || ''} ${surgery.SURG_STATUS || ''} ${surgery.SURG_NOTES || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-heading">
                My Surgical Procedures
              </h1>
              <span className="badge-counter">
                {surgeries.length} Assigned
              </span>
            </div>
            <p className="text-muted mt-1">
              Surgical operative schedules, assigned theater bookings, and postoperative documentation
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
              <span>Schedule Surgery</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Assigned Surgeries</p>
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
                <p className="text-xs text-muted font-medium">Successfully Completed</p>
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
                <p className="text-xs text-muted font-medium">Scheduled Procedures</p>
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
                placeholder="Search surgeries by patient name, procedure code, surgery type, or notes..."
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
        ) : filteredSurgeries.length === 0 ? (
          <Card className="card p-12 text-center border border-border">
            <div className="w-16 h-16 rounded-2xl kpi-icon-primary mx-auto mb-4 flex items-center justify-center">
              <Scissors className="w-8 h-8" />
            </div>
            <p className="text-heading font-semibold text-lg">No surgeries found</p>
            <p className="text-muted text-sm mt-1">Try adjusting your search query or schedule a new procedure</p>
            <Button onClick={handleAddNew} className="btn-primary mt-4">
              <Plus className="w-4 h-4 mr-1.5" /> Schedule First Surgery
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredSurgeries.map((surgery, index) => {
                const patientName = surgery.SURG_PAT_NAME || `${surgery.PAT_FNAME || ''} ${surgery.PAT_LNAME || ''}`.trim() || 'Patient';
                return (
                  <motion.div
                    key={surgery.SURG_ID}
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
                            <Scissors className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-heading">
                              Surgery #{surgery.SURG_NUMBER}
                            </CardTitle>
                            <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                              <User className="w-3 h-3 text-primary" />
                              <span className="font-medium text-foreground">{patientName}</span>
                              {surgery.SURG_PAT_NUMBER && (
                                <span className="table-id-link">({surgery.SURG_PAT_NUMBER})</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={surgery.SURG_STATUS} showIcon />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(surgery)}
                            className="table-action-edit hover-lift cursor-pointer h-8 w-8"
                            title="Edit Surgery"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(surgery)}
                            disabled={safeDelete.isDeleting}
                            className="table-action-delete hover-lift cursor-pointer h-8 w-8"
                            title="Delete Surgery"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-card p-2.5 rounded-lg border border-border">
                            <span className="text-muted block text-[10px] uppercase font-semibold">Date</span>
                            <span className="font-medium text-heading mt-0.5 block">{formatDate(surgery.SURG_DATE)}</span>
                          </div>
                          <div className="bg-card p-2.5 rounded-lg border border-border">
                            <span className="text-muted block text-[10px] uppercase font-semibold">Type</span>
                            <span className="font-medium text-heading mt-0.5 block truncate">{surgery.SURG_TYPE || 'General'}</span>
                          </div>
                          <div className="bg-card p-2.5 rounded-lg border border-border">
                            <span className="text-muted block text-[10px] uppercase font-semibold">Duration</span>
                            <span className="font-medium text-heading mt-0.5 block">{surgery.SURG_DURATION || '—'}</span>
                          </div>
                        </div>
                        {surgery.SURG_NOTES && (
                          <div className="mt-3 p-2.5 rounded-lg bg-card/50 border border-border text-xs text-muted">
                            <span className="font-semibold text-foreground block mb-0.5">Notes:</span>
                            <p className="line-clamp-2">{surgery.SURG_NOTES}</p>
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

      <SurgeryForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingSurgery(undefined);
        }}
        onSuccess={handleFormSuccess}
        surgery={editingSurgery}
        doctorNumber={doctorNumber}
      />

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
