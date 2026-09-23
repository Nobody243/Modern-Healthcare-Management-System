'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Users, Download, Phone, User, Activity, Hospital, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PatientDetailModal } from './patient-detail-modal';
import { PatientForm } from './patient-form';
import { toast } from 'sonner';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';
import { StatusBadge } from '@/components/ui/status-badge';
import { exportToCSV } from '@/lib/export-csv';
import { SortableHeader, SortOrder } from '@/components/ui/sortable-header';
import { TablePagination } from '@/components/ui/table-pagination';

interface Patient {
  PAT_ID: number;
  PAT_FNAME: string;
  PAT_LNAME: string;
  PAT_NUMBER: string;
  PAT_AGE: string;
  PAT_PHONE: string;
  PAT_TYPE: string;
  PAT_AILMENT: string;
  PAT_DISCHARGE_STATUS: string;
}

export default function PatientsClient() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailPatient, setDetailPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>(undefined);
  const [sortKey, setSortKey] = useState<string>('PAT_NUMBER');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const safeDelete = useSafeDelete();

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients(skipCache = false) {
    try {
      if (patients.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/patients');
      }
      const data = await fetchWithCache<Patient[]>('/api/patients');
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      if (patients.length === 0) {
        setPatients([]);
        toast.error('Failed to load patients');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(patient: Patient) {
    safeDelete.requestDelete({
      url: `/api/patients?id=${patient.PAT_ID}`,
      itemType: 'Patient',
      itemTitle: `${patient.PAT_FNAME} ${patient.PAT_LNAME}`,
      successMessage: 'Patient deleted successfully',
      onSuccess: () => fetchPatients(true),
    });
  }

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingPatient(undefined);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPatient(undefined);
  };

  const handleSuccess = () => {
    fetchPatients(true);
    handleCloseForm();
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const sortedAndFilteredPatients = useMemo(() => {
    const list = patients.filter((patient) =>
      `${patient.PAT_FNAME || ''} ${patient.PAT_LNAME || ''} ${patient.PAT_NUMBER || ''} ${patient.PAT_PHONE || ''} ${patient.PAT_TYPE || ''} ${patient.PAT_AILMENT || ''} ${patient.PAT_DISCHARGE_STATUS || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    return list.sort((a, b) => {
      let aVal: any = a[sortKey as keyof Patient] || '';
      let bVal: any = b[sortKey as keyof Patient] || '';

      if (sortKey === 'PAT_NAME') {
        aVal = `${a.PAT_FNAME || ''} ${a.PAT_LNAME || ''}`.trim();
        bVal = `${b.PAT_FNAME || ''} ${b.PAT_LNAME || ''}`.trim();
      } else if (sortKey === 'PAT_AGE') {
        aVal = parseInt(a.PAT_AGE || '0', 10);
        bVal = parseInt(b.PAT_AGE || '0', 10);
      }

      if (typeof aVal === 'string') {
        const cmp = aVal.localeCompare(String(bVal));
        return sortOrder === 'asc' ? cmp : -cmp;
      }
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });
  }, [patients, searchTerm, sortKey, sortOrder]);

  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedAndFilteredPatients.slice(start, start + pageSize);
  }, [sortedAndFilteredPatients, currentPage, pageSize]);

  const handleExportCSV = () => {
    exportToCSV(
      `Patients_Registry_${new Date().toISOString().split('T')[0]}`,
      sortedAndFilteredPatients,
      [
        { header: 'Patient No', accessor: 'PAT_NUMBER' },
        { header: 'First Name', accessor: 'PAT_FNAME' },
        { header: 'Last Name', accessor: 'PAT_LNAME' },
        { header: 'Age', accessor: 'PAT_AGE' },
        { header: 'Contact', accessor: 'PAT_PHONE' },
        { header: 'Patient Type', accessor: 'PAT_TYPE' },
        { header: 'Primary Ailment', accessor: 'PAT_AILMENT' },
        { header: 'Discharge Status', accessor: 'PAT_DISCHARGE_STATUS' },
      ]
    );
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
            className="space-y-1"
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-heading tracking-tight">
                Patient Management
              </h1>
              <span className="badge-counter">
                {patients.length} Registered
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Comprehensive patient registry, admissions, and physician assignments
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5 flex-wrap"
          >
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="border-border text-foreground hover:bg-muted/80 flex items-center gap-2 cursor-pointer"
              title="Download CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
            <Button
              onClick={handleAddNew}
              className="btn-primary flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Patient</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Registered</p>
                <p className="text-2xl font-bold text-heading mt-1">{patients.length}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-primary shadow-sm">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">In-Patients (Ward)</p>
                <p className="text-2xl font-bold text-heading mt-1">{inPatientsCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-success shadow-sm">
                <Hospital className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Out-Patients</p>
                <p className="text-2xl font-bold text-heading mt-1">{outPatientsCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-info shadow-sm">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Currently Admitted</p>
                <p className="text-2xl font-bold text-heading mt-1">{admittedCount}</p>
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
                placeholder="Search patients by name, patient number, phone, type, or diagnosis..."
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
                <p className="text-body font-medium">Loading patient directory...</p>
              </div>
            ) : sortedAndFilteredPatients.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-muted text-muted border border-border">
                  <Users className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No patients found</p>
                <p className="text-muted text-sm">Try adjusting your search query or register a new patient</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> Register Patient
                </Button>
              </div>
            ) : (
              <div>
                <div className="overflow-x-auto">
                  <table className="table-hospital">
                    <thead>
                      <tr>
                        <th className="w-32">
                          <SortableHeader
                            label="Patient No."
                            columnKey="PAT_NUMBER"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                        <th className="w-56">
                          <SortableHeader
                            label="Name"
                            columnKey="PAT_NAME"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                        <th className="w-20">
                          <SortableHeader
                            label="Age"
                            columnKey="PAT_AGE"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                        <th className="w-44">Contact</th>
                        <th className="w-36">
                          <SortableHeader
                            label="Type"
                            columnKey="PAT_TYPE"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                        <th>
                          <SortableHeader
                            label="Primary Ailment"
                            columnKey="PAT_AILMENT"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                        <th className="w-32">
                          <SortableHeader
                            label="Status"
                            columnKey="PAT_DISCHARGE_STATUS"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                        <th className="text-right w-28">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {paginatedPatients.map((patient, index) => (
                          <motion.tr
                            key={patient.PAT_ID}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ delay: index * 0.02 }}
                          >
                            <td 
                              className="table-id-link"
                              onClick={() => setDetailPatient(patient)}
                              title="View Patient Details"
                            >
                              {patient.PAT_NUMBER}
                            </td>
                            <td 
                              className="font-semibold text-heading cursor-pointer hover:underline"
                              onClick={() => setDetailPatient(patient)}
                              title="View Patient Details"
                            >
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-primary shrink-0" />
                                <span>{patient.PAT_FNAME} {patient.PAT_LNAME}</span>
                              </div>
                            </td>
                            <td className="text-body text-sm font-medium">
                              {patient.PAT_AGE ? `${patient.PAT_AGE} yrs` : '—'}
                            </td>
                            <td className="text-muted text-xs">
                              {patient.PAT_PHONE ? (
                                <div className="flex items-center gap-1.5 text-foreground font-medium">
                                  <Phone className="w-3 h-3 text-primary" />
                                  <span>{patient.PAT_PHONE}</span>
                                </div>
                              ) : '—'}
                            </td>
                            <td>
                              <StatusBadge status={patient.PAT_TYPE || 'OutPatient'} showIcon={false} />
                            </td>
                            <td className="text-muted text-sm max-w-xs truncate">
                              {patient.PAT_AILMENT || 'General Consultation'}
                            </td>
                            <td>
                              <StatusBadge status={patient.PAT_DISCHARGE_STATUS || 'Active'} showIcon />
                            </td>
                            <td className="text-right">
                              <div className="flex gap-1.5 justify-end">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleEdit(patient)}
                                  className="table-action-edit hover-lift cursor-pointer"
                                  title="Edit Patient Record"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDelete(patient)}
                                  disabled={safeDelete.isDeleting}
                                  className="table-action-delete hover-lift cursor-pointer"
                                  title="Delete Patient Record"
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

                <TablePagination
                  currentPage={currentPage}
                  totalItems={sortedAndFilteredPatients.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <PatientDetailModal
        open={!!detailPatient}
        onClose={() => setDetailPatient(null)}
        patient={detailPatient}
      />

      <AnimatePresence>
        {showForm && (
          <PatientForm
            open={showForm}
            onClose={handleCloseForm}
            patient={editingPatient}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
