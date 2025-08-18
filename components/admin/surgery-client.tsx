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

  const fetchSurgeries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/surgery');
      if (!response.ok) throw new Error('Failed to fetch surgeries');
      const data = await response.json();
      setSurgeries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching surgeries:', error);
      toast.error('Failed to load surgeries');
      setSurgeries([]);
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
      onSuccess: fetchSurgeries,
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
    fetchSurgeries();
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-heading">
                Surgical Procedures & OT
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {surgeries.length} Procedures
              </span>
            </div>
            <p className="text-muted mt-1">
              Operation theatre bookings, lead surgeon allocations, operative types, and post-op statuses
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
              <span>Schedule Surgery</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total OT Bookings</p>
                <p className="text-2xl font-bold text-heading mt-1">{surgeries.length}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
                <Scissors className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Successfully Completed</p>
                <p className="text-2xl font-bold text-heading mt-1">{completedCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Scheduled / Upcoming</p>
                <p className="text-2xl font-bold text-heading mt-1">{scheduledCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">In Theater / Active</p>
                <p className="text-2xl font-bold text-heading mt-1">{inProgressCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
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
          <Card className="card-glass p-4 border border-slate-700/50 shadow-md backdrop-blur-md">
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
          <Card className="card overflow-hidden border border-slate-700/50 shadow-xl bg-slate-900/60 backdrop-blur-xl">
            <div className="h-1 bg-gradient-to-r from-sky-500 via-teal-500 to-cyan-500" />
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
                <p className="text-body font-medium">Loading surgical records...</p>
              </div>
            ) : filteredSurgeries.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-slate-800/80 text-muted border border-slate-700">
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
                          <td className="font-mono text-cyan-400 font-medium">
                            {surgery.SURG_NUMBER || `SURG-${surgery.SURG_ID}`}
                          </td>
                          <td className="font-semibold text-heading">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-cyan-400 shrink-0" />
                              <div>
                                <div>{surgery.SURG_PAT_NAME || 'Patient'}</div>
                                <div className="text-xs font-mono text-muted font-normal">{surgery.SURG_PAT_NUMBER}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-body text-sm font-medium">
                            <div className="flex items-center gap-1.5 text-xs text-slate-300">
                              <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Dr. {surgery.SURG_DOC_NAME || 'Surgeon'}</span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-1.5 font-medium text-heading">
                              <Scissors className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span>{surgery.SURG_TYPE || 'General Surgical Procedure'}</span>
                            </div>
                          </td>
                          <td className="text-muted text-xs">
                            {formatDate(surgery.SURG_DATE)}
                          </td>
                          <td>
                            <Badge className={`badge ${getStatusBadge(surgery.SURG_STATUS)}`}>
                              {surgery.SURG_STATUS || 'Scheduled'}
                            </Badge>
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(surgery)}
                                className="hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all hover-lift cursor-pointer"
                                title="Edit Surgery"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(surgery)}
                                disabled={safeDelete.isDeleting}
                                className="hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all hover-lift cursor-pointer"
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
