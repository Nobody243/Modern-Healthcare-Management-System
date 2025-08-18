'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, User, Calendar, Hash, Phone, MapPin, Stethoscope, Activity } from 'lucide-react';
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

    console.log('Patient form submitting payload:', payload);

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

      toast.success(patient ? 'Patient updated successfully' : 'Patient added successfully');
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
      <DialogContent key={patient?.PAT_ID || 'new'} className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            {patient ? 'Edit Patient' : 'Add New Patient'}
          </DialogTitle>
          <DialogDescription>
            {patient ? 'Update patient information' : 'Add a new patient to your care (you will be automatically assigned)'}
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
            <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fname">First Name *</Label>
                <Input
                  id="fname"
                  name="fname"
                  defaultValue={patient?.PAT_FNAME}
                  required
                  placeholder="John"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lname">Last Name *</Label>
                <Input
                  id="lname"
                  name="lname"
                  defaultValue={patient?.PAT_LNAME}
                  required
                  placeholder="Doe"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  key={patient?.PAT_DOB || 'new-dob'}
                  defaultValue={patient?.PAT_DOB ? patient.PAT_DOB.split('T')[0] : '2000-01-01'}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  defaultValue={patient?.PAT_AGE ? String(patient.PAT_AGE) : '25'}
                  required
                  placeholder="25"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
              <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Contact Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={patient?.PAT_PHONE}
                  required
                  placeholder="+1 (555) 123-4567"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={patient?.PAT_EMAIL}
                  required
                  placeholder="patient@example.com"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">Required for patient login</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact">Emergency Contact</Label>
              <Input
                id="emergency_contact"
                name="emergency_contact"
                type="tel"
                defaultValue={patient?.PAT_EMERGENCY_CONTACT}
                placeholder="+1 (555) 999-8888"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="addr">Address *</Label>
              <Textarea
                id="addr"
                name="addr"
                defaultValue={patient?.PAT_ADDR || ''}
                required
                placeholder="123 Main Street, City, State, ZIP"
                className="min-h-20"
                disabled={loading}
              />
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
              <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Medical Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" defaultValue={patient?.PAT_GENDER || 'Male'} disabled={loading}>
                  <SelectTrigger>
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
                <Label htmlFor="blood_group">Blood Group</Label>
                <Select name="blood_group" defaultValue={patient?.PAT_BLOOD_GROUP || 'O+'} disabled={loading}>
                  <SelectTrigger>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Patient Type *</Label>
                <Select name="type" defaultValue={patient?.PAT_TYPE || 'OutPatient'} required disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="InPatient">InPatient</SelectItem>
                    <SelectItem value="OutPatient">OutPatient</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {patient && (
                <div className="space-y-2">
                  <Label htmlFor="discharge_status">Discharge Status</Label>
                  <Input
                    id="discharge_status"
                    name="discharge_status"
                    defaultValue={patient?.PAT_DISCHARGE_STATUS}
                    placeholder="Admitted / Discharged"
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ailment">Ailment / Condition *</Label>
              <Textarea
                id="ailment"
                name="ailment"
                defaultValue={patient?.PAT_AILMENT}
                required
                placeholder="Describe the patient's condition..."
                className="min-h-25"
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : patient ? (
                'Update Patient'
              ) : (
                'Add Patient'
              )}
            </Button>
          </DialogFooter>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
