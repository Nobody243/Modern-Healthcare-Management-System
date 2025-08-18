'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Users, UserCheck, HeartPulse, Hospital, Phone, User, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PatientDetailModal } from './patient-detail-modal';
import { PatientForm } from './patient-form';
import { toast } from 'sonner';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';

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
  const safeDelete = useSafeDelete();

  useEffect(() => {
    fetchPatients();
  }, []);

  async function fetchPatients() {
    try {
      setLoading(true);
      const res = await fetch('/api/patients');
      if (!res.ok) throw new Error('Failed to fetch patients');
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
      toast.error('Failed to load patients');
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
      onSuccess: fetchPatients,
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
    fetchPatients();
    handleCloseForm();
  };

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) =>
      `${patient.PAT_FNAME || ''} ${patient.PAT_LNAME || ''} ${patient.PAT_NUMBER || ''} ${patient.PAT_PHONE || ''} ${patient.PAT_TYPE || ''} ${patient.PAT_AILMENT || ''} ${patient.PAT_DISCHARGE_STATUS || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

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

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('discharge')) return 'badge-success';
    if (s.includes('admit') || s.includes('active')) return 'badge-info';
    if (s.includes('transfer')) return 'badge-warning';
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
                Patient Management
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {patients.length} Registered
              </span>
            </div>
            <p className="text-muted mt-1">
              Comprehensive patient registry, admissions, discharge status, and clinical assignments
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
              <span>Register New Patient</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Registered</p>
                <p className="text-2xl font-bold text-heading mt-1">{patients.length}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">In-Patients (Ward)</p>
                <p className="text-2xl font-bold text-heading mt-1">{inPatientsCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
                <Hospital className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Out-Patients</p>
                <p className="text-2xl font-bold text-heading mt-1">{outPatientsCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Currently Admitted</p>
                <p className="text-2xl font-bold text-heading mt-1">{admittedCount}</p>
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
          <Card className="card overflow-hidden border border-slate-700/50 shadow-xl bg-slate-900/60 backdrop-blur-xl">
            <div className="h-1 bg-gradient-to-r from-sky-500 via-teal-500 to-cyan-500" />
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
                <p className="text-body font-medium">Loading patient directory...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-slate-800/80 text-muted border border-slate-700">
                  <Users className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No patients found</p>
                <p className="text-muted text-sm">Try adjusting your search query or register a new patient</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> Register Patient
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-32">Patient No.</th>
                      <th className="w-56">Name</th>
                      <th className="w-20">Age</th>
                      <th className="w-44">Contact</th>
                      <th className="w-36">Type</th>
                      <th>Primary Ailment</th>
                      <th className="w-32">Status</th>
                      <th className="text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredPatients.map((patient, index) => (
                        <motion.tr
                          key={patient.PAT_ID}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <td 
                            className="font-mono text-cyan-400 font-medium cursor-pointer hover:underline"
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
                              <User className="w-4 h-4 text-cyan-400 shrink-0" />
                              <span>{patient.PAT_FNAME} {patient.PAT_LNAME}</span>
                            </div>
                          </td>
                          <td className="text-body text-sm font-medium">
                            {patient.PAT_AGE ? `${patient.PAT_AGE} yrs` : '—'}
                          </td>
                          <td className="text-muted text-xs">
                            {patient.PAT_PHONE ? (
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <Phone className="w-3 h-3 text-cyan-400" />
                                <span>{patient.PAT_PHONE}</span>
                              </div>
                            ) : '—'}
                          </td>
                          <td>
                            <Badge className={`badge ${patient.PAT_TYPE === 'InPatient' ? 'badge-info' : 'badge-success'}`}>
                              {patient.PAT_TYPE || 'OutPatient'}
                            </Badge>
                          </td>
                          <td className="text-muted text-sm max-w-xs truncate">
                            {patient.PAT_AILMENT || 'General Consultation'}
                          </td>
                          <td>
                            <Badge className={`badge ${getStatusBadge(patient.PAT_DISCHARGE_STATUS)}`}>
                              {patient.PAT_DISCHARGE_STATUS || 'Admitted'}
                            </Badge>
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(patient)}
                                className="hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all hover-lift cursor-pointer"
                                title="Edit Patient Record"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(patient)}
                                disabled={safeDelete.isDeleting}
                                className="hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all hover-lift cursor-pointer"
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
