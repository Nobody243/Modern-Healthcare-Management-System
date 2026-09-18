'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Loader2, Plus, Edit, Search, Phone, Mail, UserCheck, Hospital, Activity, User } from 'lucide-react';
import { PatientForm } from './patient-form';
import { toast } from 'sonner';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';

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
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();

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

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) =>
      `${patient.PAT_FNAME || ''} ${patient.PAT_LNAME || ''} ${patient.PAT_NUMBER || ''} ${patient.PAT_PHONE || ''} ${patient.PAT_AILMENT || ''} ${patient.PAT_TYPE || ''}`
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
                My Assigned Patients
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {patients.length} Active Cases
              </span>
            </div>
            <p className="text-muted mt-1">
              {doctor ? `Under Primary Care of Dr. ${doctor.DOC_FNAME} ${doctor.DOC_LNAME}` : 'Patient caseload management and clinical rounds'}
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
              <span>Admit Patient</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Assigned Caseload</p>
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
                <p className="text-xs text-muted font-medium">In-Patients (Wards)</p>
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
                <p className="text-xs text-muted font-medium">Out-Patient Followups</p>
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
                placeholder="Search assigned patients by name, patient number, phone, or diagnosis..."
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
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
          </div>
        ) : filteredPatients.length === 0 ? (
          <Card className="card p-12 text-center border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mx-auto mb-4 flex items-center justify-center text-cyan-400">
              <Users className="w-8 h-8" />
            </div>
            <p className="text-heading font-semibold text-lg">No assigned patients found</p>
            <p className="text-muted text-sm mt-1">Try adjusting your search query or admit a new patient</p>
            <Button onClick={handleAddNew} className="btn-primary mt-4">
              <Plus className="w-4 h-4 mr-1.5" /> Admit First Patient
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredPatients.map((patient, index) => (
                <motion.div
                  key={patient.PAT_ID}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Card className="card overflow-hidden border border-slate-700/50 hover:border-cyan-500/40 transition-all bg-slate-900/60 backdrop-blur-xl shadow-lg hover:shadow-cyan-500/5">
                    <div className="h-1 bg-gradient-to-r from-sky-500 via-teal-500 to-cyan-500" />
                    <CardHeader className="flex flex-row items-start justify-between pb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-heading">
                            {patient.PAT_FNAME} {patient.PAT_LNAME}
                          </CardTitle>
                          <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
                            <span className="font-mono text-cyan-400 font-medium">{patient.PAT_NUMBER}</span>
                            <span>•</span>
                            <span className="text-slate-300 font-medium">{patient.PAT_TYPE || 'OutPatient'}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge className={`badge ${getStatusBadge(patient.PAT_DISCHARGE_STATUS)}`}>
                          {patient.PAT_DISCHARGE_STATUS || 'Admitted'}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(patient)}
                          className="hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all hover-lift cursor-pointer h-8 w-8"
                          title="Edit Patient Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 mb-3">
                        <span className="text-muted block text-[10px] uppercase font-semibold mb-0.5">Primary Ailment / Diagnosis</span>
                        <p className="text-xs text-heading font-medium line-clamp-2">{patient.PAT_AILMENT || 'General Clinical Observation'}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-slate-800">
                        {patient.PAT_PHONE ? (
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Phone className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{patient.PAT_PHONE}</span>
                          </div>
                        ) : (
                          <span>No phone on file</span>
                        )}
                        {patient.PAT_EMAIL && (
                          <div className="flex items-center gap-1.5 text-muted truncate max-w-[180px]">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="truncate">{patient.PAT_EMAIL}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
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
    </>
  );
}
