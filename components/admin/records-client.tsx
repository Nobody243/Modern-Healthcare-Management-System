'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, FileText, ClipboardList, User, Users, Calendar, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import RecordsForm, { MedicalRecord } from './records-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';

export default function RecordsClient() {
  const safeDelete = useSafeDelete();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async (skipCache = false) => {
    try {
      if (records.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/records');
      }
      const data = await fetchWithCache<MedicalRecord[]>('/api/records');
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching records:', error);
      if (records.length === 0) {
        toast.error('Failed to load medical records');
        setRecords([]);
      }
    } finally {
      setLoading(false);
    }
  };

  function handleDelete(record: MedicalRecord) {
    safeDelete.requestDelete({
      url: `/api/records?id=${record.MDR_ID}`,
      itemType: 'Medical Record',
      itemTitle: record.MDR_NUMBER || `Record #${record.MDR_ID}`,
      successMessage: 'Medical record deleted successfully',
      onSuccess: () => fetchRecords(true),
    });
  }

  const handleEdit = (record: MedicalRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingRecord(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleSuccess = () => {
    fetchRecords(true);
    handleCloseForm();
  };

  const filteredRecords = useMemo(() => {
    return records.filter((record) =>
      `${record.MDR_PAT_NAME || ''} ${record.MDR_PAT_NUMBER || ''} ${record.MDR_NUMBER || ''} ${record.MDR_PAT_AILMENT || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  // Dynamic KPI Stats
  const uniquePatients = useMemo(() => {
    const set = new Set(records.map((r) => r.MDR_PAT_NUMBER).filter(Boolean));
    return set.size;
  }, [records]);

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
                Medical Records & Charts
              </h1>
              <span className="badge-counter">
                {records.length} Case Files
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Longitudinal patient health records, clinical documentation, and diagnostic histories
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
              <span>New Medical Record</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Documented Charts</p>
                <p className="text-2xl font-bold text-heading mt-1">{records.length}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-primary shadow-sm">
                <ClipboardList className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Unique Patients Tracked</p>
                <p className="text-2xl font-bold text-heading mt-1">{uniquePatients}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-success shadow-sm">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Archive Integrity</p>
                <p className="text-2xl font-bold text-heading mt-1">Verified 3NF</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-info shadow-sm">
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
                placeholder="Search records by record number, patient name, patient number, or diagnosis..."
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
                <p className="text-body font-medium">Loading medical records...</p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-muted text-muted border border-border">
                  <FileText className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No medical records found</p>
                <p className="text-muted text-sm">Try adjusting your search query or create a new medical record</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> New Record
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-32">Record No.</th>
                      <th className="w-32">Patient No.</th>
                      <th className="w-56">Patient Name</th>
                      <th>Primary Clinical Diagnosis & Chart Notes</th>
                      <th className="w-36">Date</th>
                      <th className="text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredRecords.map((record, index) => (
                        <motion.tr
                          key={record.MDR_ID}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <td className="table-id-link">
                            {record.MDR_NUMBER || `MDR-${record.MDR_ID}`}
                          </td>
                          <td className="font-mono text-xs text-muted font-medium">
                            {record.MDR_PAT_NUMBER}
                          </td>
                          <td className="font-semibold text-heading">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-primary shrink-0" />
                              <span>{record.MDR_PAT_NAME}</span>
                            </div>
                          </td>
                          <td className="text-body text-sm max-w-md truncate">
                            {record.MDR_PAT_AILMENT || 'Clinical Observation'}
                          </td>
                          <td className="text-muted text-xs">
                            {formatDate(record.MDR_DATE_REC)}
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(record)}
                                className="table-action-edit hover-lift cursor-pointer"
                                title="Edit Record"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(record)}
                                disabled={safeDelete.isDeleting}
                                className="table-action-delete hover-lift cursor-pointer"
                                title="Delete Record"
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
          <RecordsForm
            record={editingRecord}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
