'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, User, Calendar, Hash, Phone, MapPin, Stethoscope, FileText, ClipboardList, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/ui/combobox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Patient {
  PAT_ID: number;
  PAT_FNAME: string;
  PAT_LNAME: string;
  PAT_NUMBER: string;
  PAT_DOB?: string;
  PAT_AGE?: string;
  PAT_ADDR?: string;
  PAT_PHONE?: string;
  PAT_EMAIL?: string;
  PAT_TYPE?: string;
  PAT_AILMENT?: string;
  PAT_DISCHARGE_STATUS?: string;
  PAT_ASSIGNED_DOC?: string;
  PAT_GENDER?: string;
  PAT_BLOOD_GROUP?: string;
  PAT_EMERGENCY_CONTACT?: string;
}

interface PatientFormProps {
  open: boolean;
  onClose: () => void;
  patient?: Patient;
  onSuccess: () => void;
}

export function PatientForm({ open, onClose, patient, onSuccess }: PatientFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState<Array<{ DOC_NUMBER: string; DOC_FNAME: string; DOC_LNAME: string }>>([]);
  const [selectedDoctor, setSelectedDoctor] = useState(patient?.PAT_ASSIGNED_DOC || '');

  const isEdit = !!patient;

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch('/api/doctors');
        if (res.ok) {
          const data = await res.json();
          setDoctors(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
      }
    }
    if (open) {
      fetchDoctors();
      setSelectedDoctor(patient?.PAT_ASSIGNED_DOC || '');
    }
  }, [open, patient]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      id: patient?.PAT_ID,
      fname: formData.get('fname'),
      lname: formData.get('lname'),
      dob: formData.get('dob'),
      age: formData.get('age'),
      number: patient?.PAT_NUMBER, // Keep existing number for edit, let API generate for new
      addr: formData.get('addr'),
      phone: formData.get('phone'),
      email: formData.get('email') || null,
      type: formData.get('type'),
      ailment: formData.get('ailment'),
      assigned_doc: selectedDoctor || null,
      discharge_status: formData.get('discharge_status') || null,
      gender: formData.get('gender') || null,
      blood_group: formData.get('blood_group') || null,
      emergency_contact: formData.get('emergency_contact') || null,
    };

    try {
      const url = '/api/patients';
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save patient');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent key={patient?.PAT_ID || 'new'} className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-7 h-7 text-sky-600 dark:text-sky-400" />
            {isEdit ? 'Edit Patient' : 'Add New Patient'}
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            {isEdit ? 'Update patient information' : 'Fill in the patient details below'}
          </DialogDescription>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-6 mt-4"
        >
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              <User className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fname" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  First Name *
                </Label>
                <Input
                  id="fname"
                  name="fname"
                  defaultValue={patient?.PAT_FNAME}
                  required
                  placeholder="John"
                  className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lname" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Last Name *
                </Label>
                <Input
                  id="lname"
                  name="lname"
                  defaultValue={patient?.PAT_LNAME}
                  required
                  placeholder="Doe"
                  className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Date of Birth *
                </Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  defaultValue={patient?.PAT_DOB}
                  required
                  className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Age *
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  defaultValue={patient?.PAT_AGE}
                  required
                  placeholder="25"
                  className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              <Phone className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Contact Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={patient?.PAT_PHONE}
                  required
                  placeholder="+1 (555) 123-4567"
                  className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={patient?.PAT_EMAIL}
                  placeholder="patient@example.com"
                  className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                  disabled={loading}
                  required
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">Required for patient login</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_contact" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Emergency Contact
                </Label>
                <Input
                  id="emergency_contact"
                  name="emergency_contact"
                  type="tel"
                  defaultValue={patient?.PAT_EMERGENCY_CONTACT}
                  placeholder="+1 (555) 999-8888"
                  className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="addr" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Address *
              </Label>
              <Textarea
                id="addr"
                name="addr"
                defaultValue={patient?.PAT_ADDR}
                required
                placeholder="123 Main Street, City, State, ZIP"
                className="min-h-20 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                disabled={loading}
              />
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
              <Stethoscope className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Medical Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Gender
                </Label>
                <Select name="gender" defaultValue={patient?.PAT_GENDER} disabled={loading}>
                  <SelectTrigger className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                    <SelectItem value="Male" className="text-slate-900 dark:text-white">Male</SelectItem>
                    <SelectItem value="Female" className="text-slate-900 dark:text-white">Female</SelectItem>
                    <SelectItem value="Other" className="text-slate-900 dark:text-white">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blood_group" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Blood Group
                </Label>
                <Select name="blood_group" defaultValue={patient?.PAT_BLOOD_GROUP} disabled={loading}>
                  <SelectTrigger className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                    <SelectItem value="A+" className="text-slate-900 dark:text-white">A+</SelectItem>
                    <SelectItem value="A-" className="text-slate-900 dark:text-white">A-</SelectItem>
                    <SelectItem value="B+" className="text-slate-900 dark:text-white">B+</SelectItem>
                    <SelectItem value="B-" className="text-slate-900 dark:text-white">B-</SelectItem>
                    <SelectItem value="AB+" className="text-slate-900 dark:text-white">AB+</SelectItem>
                    <SelectItem value="AB-" className="text-slate-900 dark:text-white">AB-</SelectItem>
                    <SelectItem value="O+" className="text-slate-900 dark:text-white">O+</SelectItem>
                    <SelectItem value="O-" className="text-slate-900 dark:text-white">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Patient Type *
                </Label>
                <Select name="type" defaultValue={patient?.PAT_TYPE} required disabled={loading}>
                  <SelectTrigger className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                    <SelectItem value="InPatient" className="text-slate-900 dark:text-white">InPatient</SelectItem>
                    <SelectItem value="OutPatient" className="text-slate-900 dark:text-white">OutPatient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assigned_doc" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  Assigned Doctor
                </Label>
                <Combobox
                  options={doctors.map((doc) => ({
                    value: doc.DOC_NUMBER,
                    label: `Dr. ${doc.DOC_FNAME} ${doc.DOC_LNAME}`
                  }))}
                  value={selectedDoctor}
                  onChange={setSelectedDoctor}
                  placeholder="Select doctor"
                  searchPlaceholder="Search doctors..."
                  emptyMessage="No doctor found."
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">

              {isEdit && (
                <div className="space-y-2">
                  <Label htmlFor="discharge_status" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    Discharge Status
                  </Label>
                  <Input
                    id="discharge_status"
                    name="discharge_status"
                    defaultValue={patient?.PAT_DISCHARGE_STATUS}
                    placeholder="Active / Discharged"
                    className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ailment" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Ailment / Condition *
              </Label>
              <Textarea
                id="ailment"
                name="ailment"
                defaultValue={patient?.PAT_AILMENT}
                required
                placeholder="Describe the patient's condition..."
                className="min-h-25 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg text-sm text-sky-600 dark:text-sky-400"
            >
              {error}
            </motion.div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 dark:from-sky-500 dark:to-sky-600 dark:hover:from-sky-600 dark:hover:to-sky-700 text-white shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                'Update Patient'
              ) : (
                'Add Patient'
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
