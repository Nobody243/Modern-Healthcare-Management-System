'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TestTube2, Loader2, Plus, Edit, Trash2, Search, CheckCircle2, Clock, FlaskConical, User, FileText } from 'lucide-react';
import { LaboratoryForm } from './laboratory-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';
import { StatusBadge } from '@/components/ui/status-badge';

interface LabTest {
  LAB_ID: number;
  LAB_NUMBER: string;
  LAB_PAT_NUMBER: string;
  LAB_PAT_NAME: string;
  LAB_PAT_AILMENT: string;
  LAB_PAT_TESTS: string;
  LAB_PAT_RESULTS: string;
  LAB_STATUS: string;
  LAB_DATE_REC: string;
  LAB_COMPLETED_DATE?: string;
  LAB_DOC_NUMBER: string;
  PAT_FNAME?: string;
  PAT_LNAME?: string;
  DOC_FNAME?: string;
  DOC_LNAME?: string;
}

export default function DoctorLaboratoryClient() {
  const safeDelete = useSafeDelete();
  const searchParams = useSearchParams();
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorNumber, setDoctorNumber] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingLabTest, setEditingLabTest] = useState<LabTest | undefined>();

  useEffect(() => {
    fetchLabTests();
    if (searchParams.get('action') === 'add') {
      setFormOpen(true);
    }
  }, [searchParams]);

  const fetchLabTests = async (skipCache = false) => {
    try {
      if (labTests.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/laboratory');
        invalidateApiCache('/api/doctors');
      }
      const doctor = await fetchWithCache<any>('/api/doctors/me');
      setDoctorNumber(doctor.DOC_NUMBER);

      const data = await fetchWithCache<LabTest[]>(`/api/doctors/${doctor.DOC_NUMBER}/laboratory`);
      setLabTests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching laboratory tests:', error);
      if (labTests.length === 0) {
        toast.error('Failed to load laboratory tests');
        setLabTests([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (labTest: LabTest) => {
    setEditingLabTest(labTest);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingLabTest(undefined);
    setFormOpen(true);
  };

  function handleDelete(labTest: LabTest) {
    safeDelete.requestDelete({
      url: `/api/laboratory?id=${labTest.LAB_ID}`,
      itemType: 'Lab Test',
      itemTitle: labTest.LAB_NUMBER || `Lab #${labTest.LAB_ID}`,
      successMessage: 'Lab test deleted successfully',
      onSuccess: () => fetchLabTests(true),
    });
  }

  const handleFormSuccess = () => {
    fetchLabTests(true);
    setEditingLabTest(undefined);
  };

  const filteredLabTests = useMemo(() => {
    return labTests.filter((lab) => {
      const patientName = lab.LAB_PAT_NAME || `${lab.PAT_FNAME || ''} ${lab.PAT_LNAME || ''}`;
      return `${patientName} ${lab.LAB_NUMBER || ''} ${lab.LAB_PAT_TESTS || ''} ${lab.LAB_STATUS || ''} ${lab.LAB_PAT_AILMENT || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }, [labTests, searchTerm]);

  // Dynamic KPI Stats
  const completedCount = useMemo(() => {
    return labTests.filter((l) => l.LAB_STATUS?.toLowerCase().includes('complete')).length;
  }, [labTests]);

  const inProgressCount = useMemo(() => {
    return labTests.filter((l) => l.LAB_STATUS?.toLowerCase().includes('progress')).length;
  }, [labTests]);

  const pendingCount = useMemo(() => {
    return labTests.filter((l) => l.LAB_STATUS?.toLowerCase().includes('pending')).length;
  }, [labTests]);

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
                Laboratory Diagnostic Tests
              </h1>
              <span className="badge-counter">
                {labTests.length} Ordered
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Order laboratory tests, monitor blood panels, and review pathology reports
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
              <span>Order Lab Test</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Requisitions Placed</p>
                <p className="text-2xl font-bold text-heading mt-1">{labTests.length}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-primary">
                <FlaskConical className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Verified Results</p>
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
                <p className="text-xs text-muted font-medium">In Assay / Lab</p>
                <p className="text-2xl font-bold text-heading mt-1">{inProgressCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-info">
                <TestTube2 className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Pending Sampling</p>
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
                placeholder="Search tests by patient, test name, test code, or status..."
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
        ) : filteredLabTests.length === 0 ? (
          <Card className="card p-12 text-center border border-border">
            <div className="w-16 h-16 rounded-2xl kpi-icon-primary mx-auto mb-4 flex items-center justify-center">
              <FlaskConical className="w-8 h-8" />
            </div>
            <p className="text-heading font-semibold text-lg">No laboratory tests found</p>
            <p className="text-muted text-sm mt-1">Try adjusting your search query or order a new test</p>
            <Button onClick={handleAddNew} className="btn-primary mt-4">
              <Plus className="w-4 h-4 mr-1.5" /> Order First Lab Test
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredLabTests.map((lab, index) => {
                const patientName = lab.LAB_PAT_NAME || `${lab.PAT_FNAME || ''} ${lab.PAT_LNAME || ''}`.trim() || 'Patient';
                return (
                  <motion.div
                    key={lab.LAB_ID}
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
                            <FlaskConical className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-heading">
                              Lab #{lab.LAB_NUMBER}
                            </CardTitle>
                            <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                              <User className="w-3 h-3 text-primary" />
                              <span className="font-medium text-foreground">{patientName}</span>
                              {lab.LAB_PAT_NUMBER && (
                                <span className="table-id-link">({lab.LAB_PAT_NUMBER})</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={lab.LAB_STATUS || 'Completed'} showIcon />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(lab)}
                            className="table-action-edit hover-lift cursor-pointer h-8 w-8"
                            title="Edit Lab Test"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(lab)}
                            disabled={safeDelete.isDeleting}
                            className="table-action-delete hover-lift cursor-pointer h-8 w-8"
                            title="Delete Lab Test"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-card p-2.5 rounded-lg border border-border">
                            <span className="text-muted block text-[10px] uppercase font-semibold">Ordered Date</span>
                            <span className="font-medium text-heading mt-0.5 block">{formatDate(lab.LAB_DATE_REC)}</span>
                          </div>
                          <div className="bg-card p-2.5 rounded-lg border border-border">
                            <span className="text-muted block text-[10px] uppercase font-semibold">Diagnosis / Ailment</span>
                            <span className="font-medium text-heading mt-0.5 block truncate">{lab.LAB_PAT_AILMENT || 'General Panel'}</span>
                          </div>
                        </div>
                        {lab.LAB_PAT_TESTS && (
                          <div className="mt-2.5 p-2.5 rounded-lg bg-card/50 border border-border text-xs">
                            <span className="font-semibold text-foreground block mb-0.5">Tests Ordered:</span>
                            <p className="text-muted line-clamp-1">{lab.LAB_PAT_TESTS}</p>
                          </div>
                        )}
                        {lab.LAB_PAT_RESULTS && (
                          <div className="mt-2.5 p-2.5 rounded-lg bg-kpi-success-subtle border border-border text-xs">
                            <span className="font-semibold text-kpi-success block mb-0.5">Lab Results:</span>
                            <p className="text-foreground line-clamp-2">{lab.LAB_PAT_RESULTS}</p>
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

      <LaboratoryForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingLabTest(undefined);
        }}
        onSuccess={handleFormSuccess}
        labTest={editingLabTest}
        doctorNumber={doctorNumber}
      />

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
