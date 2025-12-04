'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, User, Calendar, Hash, Phone, MapPin, Stethoscope, FileText, ClipboardList, Activity, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

interface Patient {
  PAT_ID: number;
  PAT_FNAME: string;
  PAT_LNAME: string;
  PAT_NUMBER: string;
  PAT_DOB?: string;
  PAT_AGE?: string;
  PAT_ADDR?: string;
  PAT_PHONE?: string;
  PAT_TYPE?: string;
  PAT_AILMENT?: string;
  PAT_DISCHARGE_STATUS?: string;
  PAT_EMAIL?: string;
  PAT_GENDER?: string;
  PAT_BLOOD_GROUP?: string;
  PAT_EMERGENCY_CONTACT?: string;
}

interface PatientFormPageProps {
  patient?: Patient;
}

export default function PatientFormPage({ patient }: PatientFormPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patientType, setPatientType] = useState(patient?.PAT_TYPE || '');

  const isEdit = !!patient;

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
      number: formData.get('number'),
      addr: formData.get('addr'),
      phone: formData.get('phone'),
      type: patientType,
      ailment: formData.get('ailment'),
      discharge_status: formData.get('discharge_status') || null,
      email: formData.get('email'),
      gender: formData.get('gender'),
      blood_group: formData.get('blood_group'),
      emergency_contact: formData.get('emergency_contact'),
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

      router.push('/admin/patients');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-hospital-gradient p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link href="/admin/patients">
            <Button variant="outline" className="mb-4 btn-secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Patients
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-heading">
              {isEdit ? 'Edit Patient' : 'Add New Patient'}
            </h1>
          </div>
          <p className="text-muted">
            {isEdit ? 'Update patient information below' : 'Fill in the patient details to add them to the system'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-heading flex items-center gap-2 border-b border-border pb-3">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fname" className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-primary" />
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
                  <Label htmlFor="lname" className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-primary" />
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

                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    Date of Birth *
                  </Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    defaultValue={patient?.PAT_DOB}
                    required
                    className="input-hospital"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-primary" />
                    Age *
                  </Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    defaultValue={patient?.PAT_AGE}
                    required
                    placeholder="25"
                    className="input-hospital"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-heading flex items-center gap-2 border-b border-border pb-3">
                <Phone className="w-5 h-5 text-primary" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="number" className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-primary" />
                    Patient Number *
                  </Label>
                  <Input
                    id="number"
                    name="number"
                    defaultValue={patient?.PAT_NUMBER}
                    required
                    placeholder="P-2024-001"
                    className="input-hospital"
                    disabled={loading || isEdit}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-primary" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={patient?.PAT_PHONE}
                    required
                    placeholder="+1 (555) 123-4567"
                    className="input-hospital"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-primary" />
                    Email
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact" className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-primary" />
                    Emergency Contact
                  </Label>
                  <Input
                    id="emergency_contact"
                    name="emergency_contact"
                    type="tel"
                    defaultValue={patient?.PAT_EMERGENCY_CONTACT}
                    placeholder="+1 (555) 987-6543"
                    className="input-hospital"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addr" className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  Address *
                </Label>
                <Textarea
                  id="addr"
                  name="addr"
                  defaultValue={patient?.PAT_ADDR}
                  required
                  placeholder="123 Main Street, City, State, ZIP"
                  className="textarea-hospital min-h-24"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-heading flex items-center gap-2 border-b border-border pb-3">
                <Stethoscope className="w-5 h-5 text-primary" />
                Medical Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-primary" />
                    Gender
                  </Label>
                  <Select name="gender" defaultValue={patient?.PAT_GENDER || ''} disabled={loading}>
                    <SelectTrigger className="select-hospital">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blood_group" className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-primary" />
                    Blood Group
                  </Label>
                  <Select name="blood_group" defaultValue={patient?.PAT_BLOOD_GROUP || ''} disabled={loading}>
                    <SelectTrigger className="select-hospital">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4 text-primary" />
                    Patient Type *
                  </Label>
                  <Select value={patientType} onValueChange={setPatientType} required disabled={loading}>
                    <SelectTrigger className="select-hospital">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="InPatient">InPatient</SelectItem>
                      <SelectItem value="OutPatient">OutPatient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isEdit && (
                  <div className="space-y-2">
                    <Label htmlFor="discharge_status" className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-primary" />
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
                <Label htmlFor="ailment" className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-primary" />
                  Ailment / Condition *
                </Label>
                <Textarea
                  id="ailment"
                  name="ailment"
                  defaultValue={patient?.PAT_AILMENT}
                  required
                  placeholder="Describe the patient's condition..."
                  className="textarea-hospital min-h-28"
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

            <div className="flex gap-4 pt-6 border-t border-border">
              <Link href="/admin/patients" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  className="w-full h-12 btn-secondary"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 h-12"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isEdit ? (
                  'Update Patient'
                ) : (
                  'Add Patient'
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
