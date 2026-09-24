'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, User, Phone, Stethoscope, Activity, CheckCircle, Hospital } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  PAT_NUMBER: string;
  PAT_FNAME: string;
  PAT_LNAME: string;
  PAT_EMAIL: string;
  PAT_PHONE: string;
  PAT_AILMENT: string;
  PAT_TYPE: string;
  PAT_DISCHARGE_STATUS: string;
  PAT_ASSIGNED_DOC: string;
  PAT_DOB?: string;
  PAT_AGE?: string;
  PAT_ADDR?: string;
  PAT_GENDER?: string;
  PAT_BLOOD_GROUP?: string;
  PAT_EMERGENCY_CONTACT?: string;
}

interface PatientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  patient?: Patient;
  doctorNumber: string;
}

export function PatientForm({
  open,
  onOpenChange,
  onSuccess,
  patient,
  doctorNumber,
}: PatientFormProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      id: patient?.PAT_ID,
      fname: formData.get('fname'),
      lname: formData.get('lname'),
      dob: formData.get('dob'),
      age: formData.get('age'),
      number: patient?.PAT_NUMBER,
      addr: formData.get('addr'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      type: formData.get('type'),
      ailment: formData.get('ailment'),
      assignedDoc: doctorNumber,
      dischargeStatus: formData.get('discharge_status') || 'Admitted',
      gender: formData.get('gender') || null,
      blood_group: formData.get('blood_group') || null,
      emergency_contact: formData.get('emergency_contact') || null,
    };

    try {
      const url = '/api/patients';
      const method = patient ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = { error: text || 'Failed to save patient' };
        }
        throw new Error(errorData.error || 'Failed to save patient');
      }

      toast.success(patient ? 'Patient updated successfully' : 'Patient admitted successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving patient:', error);
      toast.error((error as Error).message || 'Failed to save patient');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={patient?.PAT_ID || 'new'} className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border border-border p-6 sm:p-8 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Hospital className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-heading">
                {patient ? 'Edit Patient Record' : 'Admit New Patient'}
              </DialogTitle>
              <DialogDescription className="text-muted text-xs sm:text-sm mt-0.5">
                {patient 
                  ? 'Update clinical metadata and patient profile' 
                  : 'Register and admit a new patient under your clinical care'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-6 pt-4"
        >
          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2 border-b border-border pb-2">
              <User className="w-3.5 h-3.5 text-primary" />
              Patient Personal Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fname" className="label-hospital">First Name *</Label>
                <Input
                  id="fname"
                  name="fname"
                  defaultValue={patient?.PAT_FNAME}
                  required
                  placeholder="e.g., John"
                  disabled={loading}
                  className="input-hospital h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lname" className="label-hospital">Last Name *</Label>
                <Input
                  id="lname"
                  name="lname"
                  defaultValue={patient?.PAT_LNAME}
                  required
                  placeholder="e.g., Doe"
                  disabled={loading}
                  className="input-hospital h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="dob" className="label-hospital">Date of Birth *</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  key={patient?.PAT_DOB || 'new-dob'}
                  defaultValue={patient?.PAT_DOB ? patient.PAT_DOB.split('T')[0] : '2000-01-01'}
                  required
                  disabled={loading}
                  className="input-hospital h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="age" className="label-hospital">Age *</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  defaultValue={patient?.PAT_AGE ? String(patient.PAT_AGE) : '25'}
                  required
                  placeholder="25"
                  disabled={loading}
                  className="input-hospital h-11"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2 border-b border-border pb-2">
              <Phone className="w-3.5 h-3.5 text-primary" />
              Contact & Residential Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="label-hospital">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={patient?.PAT_PHONE}
                  required
                  placeholder="+1 (555) 123-4567"
                  disabled={loading}
                  className="input-hospital h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="label-hospital">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={patient?.PAT_EMAIL}
                  required
                  placeholder="patient@example.com"
                  disabled={loading}
                  className="input-hospital h-11"
                />
                <p className="text-[11px] text-muted">Used for patient portal authentication</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emergency_contact" className="label-hospital">Emergency Contact</Label>
              <Input
                id="emergency_contact"
                name="emergency_contact"
                type="tel"
                defaultValue={patient?.PAT_EMERGENCY_CONTACT}
                placeholder="+1 (555) 999-8888 (Name & Phone)"
                disabled={loading}
                className="input-hospital h-11"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="addr" className="label-hospital">Residential Address *</Label>
              <Textarea
                id="addr"
                name="addr"
                defaultValue={patient?.PAT_ADDR || ''}
                required
                placeholder="123 Main Street, City, State, ZIP"
                className="textarea-hospital min-h-20"
                disabled={loading}
              />
            </div>
          </div>

          {/* Section 3: Clinical & Medical Metadata */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2 border-b border-border pb-2">
              <Stethoscope className="w-3.5 h-3.5 text-primary" />
              Clinical & Admission Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="gender" className="label-hospital">Gender</Label>
                <Select name="gender" defaultValue={patient?.PAT_GENDER || 'Male'} disabled={loading}>
                  <SelectTrigger className="select-hospital h-11">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="blood_group" className="label-hospital">Blood Group</Label>
                <Select name="blood_group" defaultValue={patient?.PAT_BLOOD_GROUP || 'O+'} disabled={loading}>
                  <SelectTrigger className="select-hospital h-11">
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="type" className="label-hospital">Patient Classification *</Label>
                <Select name="type" defaultValue={patient?.PAT_TYPE || 'InPatient'} required disabled={loading}>
                  <SelectTrigger className="select-hospital h-11">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="InPatient">InPatient (Admitted to Ward)</SelectItem>
                    <SelectItem value="OutPatient">OutPatient (Clinic Visit)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="discharge_status" className="label-hospital">Admission / Discharge Status</Label>
                <Select name="discharge_status" defaultValue={patient?.PAT_DISCHARGE_STATUS || 'Admitted'} disabled={loading}>
                  <SelectTrigger className="select-hospital h-11">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admitted">Admitted (Active Round)</SelectItem>
                    <SelectItem value="Under Observation">Under Observation</SelectItem>
                    <SelectItem value="Discharged">Discharged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ailment" className="label-hospital">Primary Ailment / Clinical Diagnosis *</Label>
              <Textarea
                id="ailment"
                name="ailment"
                defaultValue={patient?.PAT_AILMENT}
                required
                placeholder="Detailed clinical observation, symptoms, and primary ailment..."
                className="textarea-hospital min-h-24"
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-border flex flex-row items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="btn-secondary h-11 px-5 rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="btn-primary h-11 px-6 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : patient ? (
                'Update Patient'
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Admit Patient
                </>
              )}
            </Button>
          </DialogFooter>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
