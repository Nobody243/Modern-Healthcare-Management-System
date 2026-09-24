'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Users, Loader2, Plus, Edit, Search, Phone, Mail, UserCheck, Hospital, Activity, User, Download, ArrowUpDown, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { PatientForm } from './patient-form';
import { toast } from 'sonner';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';
import { exportToCSV } from '@/lib/export-csv';
import { TablePagination } from '@/components/ui/table-pagination';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface Patient {
  PAT_ID: number;
  PAT_FNAME: string;
  PAT_LNAME: string;
  PAT_NUMBER: string;
  PAT_PHONE: string;
  PAT_EMAIL: string;
  PAT_AILMENT: string;
  PAT_TYPE: string;
  PAT_DISCHARGE_STATUS: string;
  PAT_ASSIGNED_DOC: string;
  DOC_FNAME?: string;
  DOC_LNAME?: string;
}

interface Doctor {
  DOC_ID: number;
  DOC_FNAME: string;
  DOC_LNAME: string;
  DOC_NUMBER: string;
}

export default function DoctorPatientsClient() {
  const searchParams = useSearchParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INPATIENT' | 'OUTPATIENT'>('ALL');
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmExportOpen, setConfirmExportOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();
  const [sortField, setSortField] = useState<'name' | 'number' | 'type' | 'status'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);

  useEffect(() => {
    fetchDoctorAndPatients();
    if (searchParams.get('action') === 'add') {
      setFormOpen(true);
    }
  }, [searchParams]);

  const fetchDoctorAndPatients = async (skipCache = false) => {
    try {
      if (patients.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/doctors');
      }
      const doctorData = await fetchWithCache<Doctor>('/api/doctors/me');
      setDoctor(doctorData);

      const patientsData = await fetchWithCache<Patient[]>(`/api/doctors/${doctorData.DOC_NUMBER}/patients`);
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (patients.length === 0) {
        toast.error('Failed to load assigned patients');
        setPatients([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPatient(undefined);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    fetchDoctorAndPatients(true);
  };

  const sortedAndFilteredPatients = useMemo(() => {
    let list = patients.filter((patient) =>
      `${patient.PAT_FNAME || ''} ${patient.PAT_LNAME || ''} ${patient.PAT_NUMBER || ''} ${patient.PAT_PHONE || ''} ${patient.PAT_AILMENT || ''} ${patient.PAT_TYPE || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    if (typeFilter === 'INPATIENT') {
      list = list.filter((p) => p.PAT_TYPE?.toLowerCase().includes('inpatient') || p.PAT_TYPE?.toLowerCase().includes('in-patient'));
    } else if (typeFilter === 'OUTPATIENT') {
      list = list.filter((p) => p.PAT_TYPE?.toLowerCase().includes('outpatient') || p.PAT_TYPE?.toLowerCase().includes('out-patient'));
    }

    return list.sort((a, b) => {
      let aVal = '';
      let bVal = '';

      if (sortField === 'name') {
        aVal = `${a.PAT_FNAME || ''} ${a.PAT_LNAME || ''}`.trim();
        bVal = `${b.PAT_FNAME || ''} ${b.PAT_LNAME || ''}`.trim();
      } else if (sortField === 'number') {
        aVal = a.PAT_NUMBER || '';
        bVal = b.PAT_NUMBER || '';
      } else if (sortField === 'type') {
        aVal = a.PAT_TYPE || '';
        bVal = b.PAT_TYPE || '';
      } else if (sortField === 'status') {
        aVal = a.PAT_DISCHARGE_STATUS || '';
        bVal = b.PAT_DISCHARGE_STATUS || '';
      }

      const cmp = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [patients, searchTerm, sortField, sortDirection, typeFilter]);

  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedAndFilteredPatients.slice(start, start + pageSize);
  }, [sortedAndFilteredPatients, currentPage, pageSize]);

  const handleExportCSV = () => {
    if (sortedAndFilteredPatients.length === 0) {
      toast.error('No patient records available to export');
      return;
    }
    setConfirmExportOpen(true);
  };

  const executeExportCSV = () => {
    exportToCSV(
      `Assigned_Patients_${doctor?.DOC_NUMBER || 'Doctor'}_${new Date().toISOString().split('T')[0]}`,
      sortedAndFilteredPatients,
      [
        { header: 'Patient No', accessor: 'PAT_NUMBER' },
        { header: 'First Name', accessor: 'PAT_FNAME' },
        { header: 'Last Name', accessor: 'PAT_LNAME' },
        { header: 'Patient Type', accessor: 'PAT_TYPE' },
        { header: 'Phone', accessor: 'PAT_PHONE' },
        { header: 'Email', accessor: 'PAT_EMAIL' },
        { header: 'Primary Ailment', accessor: 'PAT_AILMENT' },
        { header: 'Discharge Status', accessor: 'PAT_DISCHARGE_STATUS' },
      ]
    );
    setConfirmExportOpen(false);
    toast.success(`Exported ${sortedAndFilteredPatients.length} patient records to CSV`);
  };

  // Dynamic KPI Stats
  const inPatientsCount = useMemo(() => {
    return patients.filter((p) => p.PAT_TYPE?.toLowerCase().includes('inpatient') || p.PAT_TYPE?.toLowerCase().includes('in-patient')).length;
  }, [patients]);

  const outPatientsCount = useMemo(() => {
    return patients.filter((p) => p.PAT_TYPE?.toLowerCase().includes('outpatient') || p.PAT_TYPE?.toLowerCase().includes('out-patient')).length;
  }, [patients]);

  const admittedCount = useMemo(() => {
    return patients.filter((p) => {
      const s = p.PAT_DISCHARGE_STATUS?.toLowerCase() || '';
      return s.includes('admit') || s.includes('active');
    }).length;
  }, [patients]);

  return (
    <>
      <div className="space-y-6">
        {/* Executive Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1 w-full sm:w-auto"
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-heading tracking-tight">
                My Assigned Patients
              </h1>
              <span className="badge-counter">
                {patients.length} Active Cases
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {doctor ? `Under Primary Care of Dr. ${doctor.DOC_FNAME} ${doctor.DOC_LNAME}` : 'Patient caseload management and clinical rounds'}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5 w-full sm:w-auto"
          >
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="border-border text-foreground hover:bg-muted/80 flex-1 sm:flex-initial flex items-center justify-center gap-2 cursor-pointer h-10 px-4"
              title="Download CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
            <Button
              onClick={handleAddNew}
              className="btn-primary flex-1 sm:flex-initial flex items-center justify-center gap-2 cursor-pointer h-10 px-4"
            >
              <Plus className="w-4 h-4" />
              <span>Admit Patient</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Assigned Caseload</p>
                <p className="text-2xl font-bold text-heading mt-1">{patients.length}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-primary">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">In-Patients (Wards)</p>
                <p className="text-2xl font-bold text-heading mt-1">{inPatientsCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-success">
                <Hospital className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Out-Patient Followups</p>
                <p className="text-2xl font-bold text-heading mt-1">{outPatientsCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-info">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border hover:border-muted-foreground/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Currently Admitted</p>
                <p className="text-2xl font-bold text-heading mt-1">{admittedCount}</p>
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
          <Card className="card-glass p-3.5 sm:p-4 border border-border shadow-md space-y-3">
            {/* Top Row: Search Input + Sort Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <Input
                  placeholder="Search assigned patients by name, ID, phone, or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="input-hospital pl-10 pr-9 h-11 text-sm bg-card/60"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-1 rounded-md transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort Selector & Direction Toggle */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="relative flex items-center">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-muted absolute left-2.5 pointer-events-none" />
                  <select
                    aria-label="Sort Field"
                    value={sortField}
                    onChange={(e) => {
                      setSortField(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="h-11 pl-8 pr-7 rounded-xl border border-border bg-card hover:bg-muted/50 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-sm appearance-none transition-all"
                  >
                    <option value="name">Name</option>
                    <option value="number">ID No</option>
                    <option value="type">Type</option>
                    <option value="status">Status</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-muted absolute right-2 pointer-events-none" />
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 rounded-xl border-border bg-card hover:bg-muted/80 shrink-0"
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Bottom Row: Full-width Segmented Patient Type Filter Pills */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-muted/80 border border-border">
              {(
                [
                  { id: 'ALL', label: 'All Cases', count: patients.length },
                  { id: 'INPATIENT', label: 'In-Patient', count: inPatientsCount },
                  { id: 'OUTPATIENT', label: 'Out-Patient', count: outPatientsCount },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setTypeFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                    typeFilter === tab.id
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                      typeFilter === tab.id
                        ? 'bg-primary/15 text-primary'
                        : 'bg-muted-foreground/15 text-muted-foreground'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Card Grid View */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-[rgb(var(--primary))]" />
          </div>
        ) : sortedAndFilteredPatients.length === 0 ? (
          <Card className="card p-12 text-center border border-border">
            <div className="w-16 h-16 rounded-2xl kpi-icon-primary mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8" />
            </div>
            <p className="text-heading font-semibold text-lg">No assigned patients found</p>
            <p className="text-muted text-sm mt-1">Try adjusting your search query or admit a new patient</p>
            <Button onClick={handleAddNew} className="btn-primary mt-4">
              <Plus className="w-4 h-4 mr-1.5" /> Admit First Patient
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {paginatedPatients.map((patient, index) => (
                  <motion.div
                    key={patient.PAT_ID}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    className="h-full"
                  >
                    <Card className="card overflow-hidden border border-border hover:border-primary/40 transition-all shadow-md flex flex-col justify-between h-full bg-card">
                      <div className="card-accent-bar" />
                      <div>
                        <CardHeader className="flex flex-row items-start justify-between pb-3 gap-3">
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div className="p-2.5 rounded-xl kpi-icon-primary shrink-0 shadow-sm mt-0.5">
                              <User className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              {/* Line 1: Patient Name on left, Edit Button on right */}
                              <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-base sm:text-lg font-bold text-heading truncate">
                                  {patient.PAT_FNAME} {patient.PAT_LNAME}
                                </CardTitle>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleEdit(patient)}
                                  className="table-action-edit hover-lift cursor-pointer h-8 w-8 shrink-0 -mt-1 -mr-1"
                                  title="Edit Patient Details"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </Button>
                              </div>

                              {/* Line 2: Patient ID & Type on left, Status Badge on right */}
                              <div className="flex items-center justify-between gap-2 mt-1.5 flex-wrap">
                                <div className="text-xs text-muted flex items-center gap-1.5 truncate">
                                  <span className="table-id-link font-mono font-bold whitespace-nowrap">{patient.PAT_NUMBER}</span>
                                  <span className="text-muted-foreground">•</span>
                                  <span className="text-heading font-semibold whitespace-nowrap">{patient.PAT_TYPE || 'OutPatient'}</span>
                                </div>
                                <StatusBadge status={patient.PAT_DISCHARGE_STATUS || 'Active'} showIcon />
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-1 pb-3">
                          <div className="p-3 rounded-xl bg-muted/40 dark:bg-muted/20 border border-border">
                            <span className="text-muted block text-[10px] uppercase font-bold tracking-wider mb-1">
                              Primary Ailment / Diagnosis
                            </span>
                            <p className="text-xs text-heading font-semibold line-clamp-2">
                              {patient.PAT_AILMENT || 'General Clinical Observation'}
                            </p>
                          </div>
                        </CardContent>
                      </div>
                      
                      <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-muted/20 dark:bg-muted/10 border-t border-border flex items-center justify-between text-xs text-muted gap-2">
                        {patient.PAT_PHONE ? (
                          <div className="flex items-center gap-1.5 text-heading font-medium truncate">
                            <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="truncate">{patient.PAT_PHONE}</span>
                          </div>
                        ) : (
                          <span className="text-muted text-[11px]">No phone on file</span>
                        )}
                        {patient.PAT_EMAIL && (
                          <div className="flex items-center gap-1.5 text-muted truncate shrink-0 max-w-[50%]" title={patient.PAT_EMAIL}>
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{patient.PAT_EMAIL}</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <TablePagination
              currentPage={currentPage}
              totalItems={sortedAndFilteredPatients.length}
              pageSize={pageSize}
              pageSizeOptions={[4, 8, 16, 32]}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </div>

      <PatientForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setSelectedPatient(undefined);
        }}
        onSuccess={handleFormSuccess}
        patient={selectedPatient}
        doctorNumber={doctor?.DOC_NUMBER || ''}
      />

      <ConfirmModal
        isOpen={confirmExportOpen}
        onClose={() => setConfirmExportOpen(false)}
        onConfirm={executeExportCSV}
        title="Export Assigned Patients"
        description={`Do you want to download a CSV export containing ${sortedAndFilteredPatients.length} patient record${sortedAndFilteredPatients.length === 1 ? '' : 's'} based on your current filters and search query?`}
        confirmText="Download CSV"
        cancelText="Cancel"
        variant="primary"
        icon="download"
      />
    </>
  );
}
