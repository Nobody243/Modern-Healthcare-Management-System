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
      <DialogContent key={patient?.PAT_ID || 'new'} className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-heading flex items-center gap-2">
            <Activity className="w-7 h-7 text-primary" />
            {isEdit ? 'Edit Patient' : 'Add New Patient'}
          </DialogTitle>
          <DialogDescription className="text-muted">
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
            <h3 className="text-sm font-semibold text-heading flex items-center gap-2 border-b border-border pb-2">
              <User className="w-4 h-4 text-primary" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fname" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted" />
                  First Name *
                </Label>
                <Input
                  id="fname"
                  name="fname"
                  defaultValue={patient?.PAT_FNAME}
                  required
                  placeholder="John"
                  className="input-hospital"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lname" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted" />
                  Last Name *
                </Label>
                <Input
                  id="lname"
                  name="lname"
                  defaultValue={patient?.PAT_LNAME}
                  required
                  placeholder="Doe"
                  className="input-hospital"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted" />
                  Date of Birth *
                </Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  defaultValue={patient?.PAT_DOB ? new Date(patient.PAT_DOB).toISOString().split('T')[0] : ''}
                  required
                  className="input-hospital"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-muted" />
                  Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  defaultValue={patient?.PAT_AGE}
                  placeholder="30"
                  className="input-hospital"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-heading flex items-center gap-2 border-b border-border pb-2">
              <Phone className="w-4 h-4 text-primary" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-muted" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={patient?.PAT_PHONE}
                  required
                  placeholder="+1 (555) 000-0000"
                  className="input-hospital"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted" />
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={patient?.PAT_EMAIL}
                  placeholder="patient@example.com"
                  className="input-hospital"
                  disabled={loading}
                />
                <p className="text-xs text-muted">Required for patient login</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_contact" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-muted" />
                  Emergency Contact
                </Label>
                <Input
                  id="emergency_contact"
                  name="emergency_contact"
                  defaultValue={patient?.PAT_EMERGENCY_CONTACT}
                  placeholder="+1 (555) 999-9999"
                  className="input-hospital"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="addr" className="text-sm font-medium text-muted flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-muted" />
                Address *
              </Label>
              <Textarea
                id="addr"
                name="addr"
                defaultValue={patient?.PAT_ADDR}
                required
                placeholder="123 Main Street, City, State, ZIP"
                className="textarea-hospital min-h-20"
                disabled={loading}
              />
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-heading flex items-center gap-2 border-b border-border pb-2">
              <Stethoscope className="w-4 h-4 text-primary" />
              Medical Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted" />
                  Gender
                </Label>
                <Select name="gender" defaultValue={patient?.PAT_GENDER} disabled={loading}>
                  <SelectTrigger className="select-hospital">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-card-foreground">
                    <SelectItem value="Male" className="text-card-foreground">Male</SelectItem>
                    <SelectItem value="Female" className="text-card-foreground">Female</SelectItem>
                    <SelectItem value="Other" className="text-card-foreground">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blood_group" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-muted" />
                  Blood Group
                </Label>
                <Select name="blood_group" defaultValue={patient?.PAT_BLOOD_GROUP} disabled={loading}>
                  <SelectTrigger className="select-hospital">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-card-foreground">
                    <SelectItem value="A+" className="text-card-foreground">A+</SelectItem>
                    <SelectItem value="A-" className="text-card-foreground">A-</SelectItem>
                    <SelectItem value="B+" className="text-card-foreground">B+</SelectItem>
                    <SelectItem value="B-" className="text-card-foreground">B-</SelectItem>
                    <SelectItem value="AB+" className="text-card-foreground">AB+</SelectItem>
                    <SelectItem value="AB-" className="text-card-foreground">AB-</SelectItem>
                    <SelectItem value="O+" className="text-card-foreground">O+</SelectItem>
                    <SelectItem value="O-" className="text-card-foreground">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-muted" />
                  Patient Type *
                </Label>
                <Select name="type" defaultValue={patient?.PAT_TYPE} required disabled={loading}>
                  <SelectTrigger className="select-hospital">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-card-foreground">
                    <SelectItem value="InPatient" className="text-card-foreground">InPatient</SelectItem>
                    <SelectItem value="OutPatient" className="text-card-foreground">OutPatient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assigned_doc" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-muted" />
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
                  <Label htmlFor="discharge_status" className="text-sm font-medium text-muted flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-muted" />
                    Discharge Status
                  </Label>
                  <Input
                    id="discharge_status"
                    name="discharge_status"
                    defaultValue={patient?.PAT_DISCHARGE_STATUS}
                    placeholder="Active / Discharged"
                    className="input-hospital"
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ailment" className="text-sm font-medium text-muted flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-muted" />
                Ailment / Condition *
              </Label>
              <Textarea
                id="ailment"
                name="ailment"
                defaultValue={patient?.PAT_AILMENT}
                required
                placeholder="Describe the patient's condition..."
                className="textarea-hospital min-h-25"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 btn-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
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
