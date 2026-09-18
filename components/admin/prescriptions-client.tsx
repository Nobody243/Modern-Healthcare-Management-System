'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, FileText, Pill, CheckCircle2, Clock, RotateCcw, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PrescriptionsForm from './prescriptions-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';

interface Prescription {
  PRES_ID: number;
  PRES_NUMBER: string;
  PRES_PAT_NUMBER: string;
  PAT_FNAME?: string;
  PAT_LNAME?: string;
  PRES_PAT_NAME?: string;
  PRES_MEDICATION: string;
  PRES_DOSAGE: string;
  PRES_FREQUENCY: string;
  PRES_DURATION: string;
  PRES_STATUS: string;
  PRES_DATE: string;
  PRES_REFILLS_REMAINING?: number;
  PRES_NOTES?: string;
  DOC_FNAME?: string;
  DOC_LNAME?: string;
  PRES_DOC_NAME?: string;
  PRES_DOC_NUMBER?: string;
}

export default function PrescriptionsClient() {
  const safeDelete = useSafeDelete();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async (skipCache = false) => {
    try {
      if (prescriptions.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/prescriptions');
      }
      const data = await fetchWithCache<Prescription[]>('/api/prescriptions');
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

  function handleDelete(prescription: Prescription) {
    safeDelete.requestDelete({
      url: `/api/prescriptions?id=${prescription.PRES_ID}`,
      itemType: 'Prescription',
      itemTitle: prescription.PRES_NUMBER || `Prescription #${prescription.PRES_ID}`,
      successMessage: 'Prescription deleted successfully',
      onSuccess: () => fetchPrescriptions(true),
    });
  }

  const handleEdit = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingPrescription(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPrescription(null);
  };

  const handleSuccess = () => {
    fetchPrescriptions(true);
    handleCloseForm();
  };

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((prescription) =>
      `${prescription.PRES_PAT_NAME || ''} ${prescription.PRES_PAT_NUMBER || ''} ${prescription.PRES_NUMBER || ''} ${prescription.PRES_MEDICATION || ''} ${prescription.PRES_DOC_NAME || ''} ${prescription.PRES_STATUS || ''}`
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
                Prescription Registry
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {prescriptions.length} Prescriptions
              </span>
            </div>
            <p className="text-muted mt-1">
              Physician prescription logs, dosage protocols, medication dispensations, and refills
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
              <span>Issue Prescription</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Prescriptions</p>
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
                <p className="text-xs text-muted font-medium">Active Courses</p>
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
                <p className="text-xs text-muted font-medium">Total Refills Remaining</p>
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
                placeholder="Search prescriptions by patient name, prescription code, medication, or physician..."
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
                <p className="text-body font-medium">Loading prescriptions registry...</p>
              </div>
            ) : filteredPrescriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-slate-800/80 text-muted border border-slate-700">
                  <FileText className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No prescriptions found</p>
                <p className="text-muted text-sm">Try adjusting your search query or create a new prescription</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> Issue Prescription
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-32">Prescription #</th>
                      <th className="w-52">Patient</th>
                      <th className="w-48">Physician</th>
                      <th className="w-56">Medication & Dosage</th>
                      <th className="w-36">Frequency</th>
                      <th className="w-32">Date</th>
                      <th className="w-32">Status</th>
                      <th className="text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredPrescriptions.map((prescription, index) => (
                        <motion.tr
                          key={prescription.PRES_ID}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <td className="font-mono text-cyan-400 font-medium">
                            {prescription.PRES_NUMBER || `RX-${prescription.PRES_ID}`}
                          </td>
                          <td className="font-semibold text-heading">
                            <div>
                              <div>{prescription.PRES_PAT_NAME || 'Patient'}</div>
                              <div className="text-xs font-mono text-muted font-normal">{prescription.PRES_PAT_NUMBER}</div>
                            </div>
                          </td>
                          <td className="text-body text-sm font-medium">
                            <div className="flex items-center gap-1.5 text-xs text-slate-300">
                              <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{prescription.PRES_DOC_NAME || 'Physician'}</span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-1.5">
                              <Pill className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <div>
                                <span className="font-medium text-heading">{prescription.PRES_MEDICATION}</span>
                                {prescription.PRES_DOSAGE && (
                                  <span className="text-xs text-muted block">{prescription.PRES_DOSAGE}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {prescription.PRES_FREQUENCY || 'Once daily'}
                            </span>
                          </td>
                          <td className="text-muted text-xs">
                            {formatDate(prescription.PRES_DATE)}
                          </td>
                          <td>
                            <Badge className={`badge ${getStatusBadge(prescription.PRES_STATUS)}`}>
                              {prescription.PRES_STATUS || 'Active'}
                            </Badge>
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(prescription)}
                                className="hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all hover-lift cursor-pointer"
                                title="Edit Prescription"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(prescription)}
                                disabled={safeDelete.isDeleting}
                                className="hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all hover-lift cursor-pointer"
                                title="Delete Prescription"
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
          <PrescriptionsForm
            prescription={editingPrescription}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
