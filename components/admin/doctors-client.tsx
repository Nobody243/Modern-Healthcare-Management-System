'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Mail, Stethoscope, UserCog, Award, HeartPulse, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DoctorForm } from './doctor-form';
import { toast } from 'sonner';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';
import { DepartmentBadge } from '@/components/ui/department-badge';

interface Doctor {
  DOC_ID: number;
  DOC_FNAME: string;
  DOC_LNAME: string;
  DOC_NUMBER: string;
  DOC_PHONE: string;
  DOC_EMAIL: string;
  DOC_DEPT: string;
  DOC_STATUS: string;
}

export default function DoctorsClient() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | undefined>();
  const safeDelete = useSafeDelete();

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors(skipCache = false) {
    try {
      if (doctors.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/doctors');
      }
      const data = await fetchWithCache<Doctor[]>('/api/doctors');
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      if (doctors.length === 0) {
        setDoctors([]);
        toast.error('Failed to load doctors');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(doctor: Doctor) {
    safeDelete.requestDelete({
      url: `/api/doctors?id=${doctor.DOC_ID}`,
      itemType: 'Doctor',
      itemTitle: `Dr. ${doctor.DOC_FNAME} ${doctor.DOC_LNAME}`,
      successMessage: 'Doctor deleted successfully',
      onSuccess: () => fetchDoctors(true),
    });
  }

  function handleEdit(doctor: Doctor) {
    setSelectedDoctor(doctor);
    setFormOpen(true);
  }

  function handleAddNew() {
    setSelectedDoctor(undefined);
    setFormOpen(true);
  }

  function handleFormSuccess() {
    toast.success(`Doctor ${selectedDoctor ? 'updated' : 'added'} successfully`);
    fetchDoctors(true);
  }

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) =>
      `${doctor.DOC_FNAME || ''} ${doctor.DOC_LNAME || ''} ${doctor.DOC_EMAIL || ''} ${doctor.DOC_DEPT || ''} ${doctor.DOC_NUMBER || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [doctors, searchTerm]);

  // Dynamic KPI Stats
  const uniqueDepts = useMemo(() => {
    const set = new Set(doctors.map((d) => d.DOC_DEPT).filter(Boolean));
    return set.size;
  }, [doctors]);

  const surgeryStaff = useMemo(() => {
    return doctors.filter((d) => d.DOC_DEPT?.toLowerCase().includes('surgery')).length;
  }, [doctors]);

  const cardioStaff = useMemo(() => {
    return doctors.filter((d) => d.DOC_DEPT?.toLowerCase().includes('cardio')).length;
  }, [doctors]);

  const deptColors: Record<string, string> = {
    Cardiology: 'badge-danger',
    Surgery: 'badge-info',
    Nursing: 'badge-success',
    Pediatrics: 'badge-warning',
    Radiology: 'badge-purple',
    Neurology: 'badge-purple',
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
                Doctors & Medical Staff
              </h1>
              <span className="badge-counter">
                {doctors.length} Physicians
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Physicians directory, clinical departments, and consulting credentials
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
              <span>Add New Doctor</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Physicians</p>
                <p className="text-2xl font-bold text-heading mt-1">{doctors.length}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-primary shadow-sm">
                <Stethoscope className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Clinical Departments</p>
                <p className="text-2xl font-bold text-heading mt-1">{uniqueDepts}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-success shadow-sm">
                <Award className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Surgical Specialists</p>
                <p className="text-2xl font-bold text-heading mt-1">{surgeryStaff}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-info shadow-sm">
                <UserCog className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Cardiology Specialists</p>
                <p className="text-2xl font-bold text-heading mt-1">{cardioStaff}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-warning shadow-sm">
                <HeartPulse className="w-5 h-5" />
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
                placeholder="Search doctors by name, license number, email, or clinical specialty..."
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
                <p className="text-body font-medium">Loading doctors directory...</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-muted text-muted border border-border">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No doctors found</p>
                <p className="text-muted text-sm">Try adjusting your search query or add a new doctor</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> Add Doctor
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-32">Doctor ID</th>
                      <th className="w-56">Name</th>
                      <th className="w-64">Email</th>
                      <th className="w-48">Department</th>
                      <th className="text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredDoctors.map((doctor, index) => (
                        <motion.tr
                          key={doctor.DOC_ID}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <td className="table-id-link">
                            {doctor.DOC_NUMBER}
                          </td>
                          <td className="font-semibold text-heading">
                            <div className="flex items-center gap-2">
                              <Stethoscope className="w-4 h-4 text-primary shrink-0" />
                              <span>Dr. {doctor.DOC_FNAME} {doctor.DOC_LNAME}</span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-1.5 text-xs text-muted">
                              <Mail className="w-3.5 h-3.5 text-muted shrink-0" />
                              <span className="truncate">{doctor.DOC_EMAIL}</span>
                            </div>
                          </td>
                          <td>
                            <DepartmentBadge department={doctor.DOC_DEPT} />
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(doctor)}
                                className="table-action-edit hover-lift cursor-pointer"
                                title="Edit Doctor Profile"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(doctor)}
                                disabled={safeDelete.isDeleting}
                                className="table-action-delete hover-lift cursor-pointer"
                                title="Delete Doctor Profile"
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

      <DoctorForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        doctor={selectedDoctor}
        onSuccess={handleFormSuccess}
      />

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
