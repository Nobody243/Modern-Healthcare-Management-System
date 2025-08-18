'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, TestTube2, CheckCircle2, Clock, FlaskConical, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LaboratoryForm, Laboratory } from './laboratory-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';

export default function LaboratoryClient() {
  const safeDelete = useSafeDelete();
  const [labs, setLabs] = useState<Laboratory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState<Laboratory | undefined>();

  const fetchLabs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/laboratory');
      if (!res.ok) throw new Error('Failed to fetch laboratory records');
      const data = await res.json();
      setLabs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching labs:', error);
      setLabs([]);
      toast.error('Failed to load laboratory records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  function handleDelete(lab: Laboratory) {
    safeDelete.requestDelete({
      url: `/api/laboratory?id=${lab.LAB_ID}`,
      itemType: 'Lab Record',
      itemTitle: lab.LAB_NUMBER || `Lab #${lab.LAB_ID}`,
      successMessage: 'Laboratory record deleted successfully',
      onSuccess: fetchLabs,
    });
  }

  function handleEdit(lab: Laboratory) {
    setSelectedLab(lab);
    setFormOpen(true);
  }

  function handleAddNew() {
    setSelectedLab(undefined);
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
    setSelectedLab(undefined);
  }

  function handleSuccess() {
    handleCloseForm();
    fetchLabs();
  }

  const filteredLabs = useMemo(() => {
    return labs.filter((lab) =>
      `${lab.LAB_PAT_NAME || ''} ${lab.LAB_PAT_NUMBER || ''} ${lab.LAB_NUMBER || ''} ${lab.LAB_STATUS || ''} ${lab.LAB_PAT_AILMENT || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [labs, searchTerm]);

  // Dynamic KPI Stats
  const completedCount = useMemo(() => {
    return labs.filter((l) => l.LAB_STATUS?.toLowerCase().includes('complete')).length;
  }, [labs]);

  const inProgressCount = useMemo(() => {
    return labs.filter((l) => l.LAB_STATUS?.toLowerCase().includes('progress')).length;
  }, [labs]);

  const pendingCount = useMemo(() => {
    return labs.filter((l) => l.LAB_STATUS?.toLowerCase().includes('pending')).length;
  }, [labs]);

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
                Laboratory Diagnostics
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {labs.length} Tests
              </span>
            </div>
            <p className="text-muted mt-1">
              Pathology tests, specimen assays, blood work, and clinical laboratory results
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
              <span>New Lab Record</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Lab Tests</p>
                <p className="text-2xl font-bold text-heading mt-1">{labs.length}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
                <FlaskConical className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Completed Results</p>
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
                <p className="text-xs text-muted font-medium">Processing / Assay</p>
                <p className="text-2xl font-bold text-heading mt-1">{inProgressCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400">
                <TestTube2 className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Pending Specimens</p>
                <p className="text-2xl font-bold text-heading mt-1">{pendingCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
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
          <Card className="card-glass p-4 border border-slate-700/50 shadow-md backdrop-blur-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                placeholder="Search lab records by test number, patient name, patient number, or diagnosis..."
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
                <p className="text-body font-medium">Loading laboratory records...</p>
              </div>
            ) : filteredLabs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-slate-800/80 text-muted border border-slate-700">
                  <TestTube2 className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No laboratory records found</p>
                <p className="text-muted text-sm">Try adjusting your search query or order a new lab test</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> New Lab Record
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-32">Lab No.</th>
                      <th className="w-32">Patient No.</th>
                      <th className="w-56">Patient Name</th>
                      <th>Clinical Diagnosis / Test</th>
                      <th className="w-36">Date</th>
                      <th className="w-32">Status</th>
                      <th className="text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredLabs.map((lab, index) => (
                        <motion.tr
                          key={lab.LAB_ID}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <td className="font-mono text-cyan-400 font-medium">
                            {lab.LAB_NUMBER}
                          </td>
                          <td className="font-mono text-xs text-muted font-medium">
                            {lab.LAB_PAT_NUMBER}
                          </td>
                          <td className="font-semibold text-heading">
                            <div className="flex items-center gap-2">
                              <TestTube2 className="w-4 h-4 text-cyan-400 shrink-0" />
                              <span>{lab.LAB_PAT_NAME}</span>
                            </div>
                          </td>
                          <td className="text-muted text-sm max-w-xs truncate">
                            {lab.LAB_PAT_AILMENT || 'General Laboratory Analysis'}
                          </td>
                          <td className="text-muted text-xs">
                            {formatDate(lab.LAB_DATE_REC || lab.LAB_COMPLETED_DATE)}
                          </td>
                          <td>
                            <Badge className={`badge ${getStatusBadge(lab.LAB_STATUS)}`}>
                              {lab.LAB_STATUS || 'Completed'}
                            </Badge>
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(lab)}
                                className="hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all hover-lift cursor-pointer"
                                title="Edit Lab Record"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(lab)}
                                disabled={safeDelete.isDeleting}
                                className="hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all hover-lift cursor-pointer"
                                title="Delete Lab Record"
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

      <LaboratoryForm
        open={formOpen}
        onClose={handleCloseForm}
        lab={selectedLab}
        onSuccess={handleSuccess}
      />

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
