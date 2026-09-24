'use client';
import { useState, useEffect } from 'react';
import { Pill, User, Calendar, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/ui/combobox';
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
  PAT_NUMBER: string;
  PAT_FNAME: string;
  PAT_LNAME: string;
}

interface Pharmaceutical {
  PHAR_ID: number;
  PHAR_NAME: string;
}

interface Prescription {
  PRES_ID: number;
  PRES_NUMBER: string;
  PRES_PAT_NUMBER: string;
  PRES_PAT_NAME?: string;
  PRES_MEDICATION: string;
  PRES_DOSAGE: string;
  PRES_FREQUENCY: string;
  PRES_DURATION: string;
  PRES_STATUS?: string;
  PRES_REFILLS_REMAINING?: number;
  PRES_NOTES?: string;
}

interface PrescriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  prescription?: Prescription;
  doctorNumber: string;
}

export function PrescriptionForm({
  open,
  onOpenChange,
  onSuccess,
  prescription,
  doctorNumber,
}: PrescriptionFormProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [pharmaceuticals, setPharmaceuticals] = useState<Pharmaceutical[]>([]);
  const [formData, setFormData] = useState({
    patNumber: prescription?.PRES_PAT_NUMBER || '',
    medication: prescription?.PRES_MEDICATION || '',
    dosage: prescription?.PRES_DOSAGE || '',
    frequency: prescription?.PRES_FREQUENCY || '',
    duration: prescription?.PRES_DURATION || '',
    status: prescription?.PRES_STATUS || 'Active',
    refillsRemaining: prescription?.PRES_REFILLS_REMAINING ?? 0,
    notes: prescription?.PRES_NOTES || '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
    fetchPharmaceuticals();
  }, []);

  useEffect(() => {
    if (prescription) {
      setFormData({
        patNumber: prescription.PRES_PAT_NUMBER || '',
        medication: prescription.PRES_MEDICATION || '',
        dosage: prescription.PRES_DOSAGE || '',
        frequency: prescription.PRES_FREQUENCY || '',
        duration: prescription.PRES_DURATION || '',
        status: prescription.PRES_STATUS || 'Active',
        refillsRemaining: prescription.PRES_REFILLS_REMAINING ?? 0,
        notes: prescription.PRES_NOTES || '',
      });
    } else {
      setFormData({
        patNumber: '',
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        status: 'Active',
        refillsRemaining: 0,
        notes: '',
      });
    }
  }, [prescription, open]);

  const fetchPatients = async () => {
    try {
      const response = await fetch(`/api/doctors/${doctorNumber}/patients`);
      if (response.ok) {
        const data = await response.json();
        setPatients(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchPharmaceuticals = async () => {
    try {
      const response = await fetch('/api/pharmaceuticals');
      if (response.ok) {
        const data = await response.json();
        setPharmaceuticals(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching pharmaceuticals:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/prescriptions';
      const method = prescription ? 'PUT' : 'POST';

      const selectedPatient = patients.find(
        (p) => p.PAT_NUMBER === formData.patNumber
      );
      const patientName = selectedPatient
        ? `${selectedPatient.PAT_FNAME} ${selectedPatient.PAT_LNAME}`
        : prescription?.PRES_PAT_NAME || '';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientNumber: formData.patNumber,
          patientName: patientName,
          medication: formData.medication,
          dosage: formData.dosage,
          frequency: formData.frequency,
          duration: formData.duration,
          status: formData.status,
          refills: formData.refillsRemaining,
          notes: formData.notes,
          doctorNumber: doctorNumber,
          ...(prescription ? { id: prescription.PRES_ID } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save prescription');
      }

      onSuccess();
      toast.success(prescription ? 'Prescription updated successfully' : 'Prescription created successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error((error as Error).message || 'Failed to save prescription');
    } finally {
      setLoading(false);
    }
  };

  const patientOptions = patients.map((p) => ({
    value: p.PAT_NUMBER,
    label: `${p.PAT_FNAME} ${p.PAT_LNAME} (${p.PAT_NUMBER})`,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border border-border p-6 sm:p-8 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-heading">
                {prescription ? 'Edit Prescription' : 'Create Clinical Prescription'}
              </DialogTitle>
              <DialogDescription className="text-muted text-xs sm:text-sm mt-0.5">
                {prescription
                  ? 'Update medication regimen and dosage parameters'
                  : 'Prescribe pharmaceutical medications and dosage to your patient'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Section 1: Patient & Medication Selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2 border-b border-border pb-2">
              <User className="w-3.5 h-3.5 text-primary" />
              Patient & Medication Selection
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="patNumber" className="label-hospital">
                  Assigned Patient *
                </Label>
                <Combobox
                  options={patientOptions}
                  value={formData.patNumber}
                  onChange={(value) =>
                    setFormData({ ...formData, patNumber: value })
                  }
                  placeholder="Select patient..."
                  searchPlaceholder="Search patients..."
                  emptyMessage="No patients found"
                  disabled={!!prescription}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="medication" className="label-hospital">
                  Medication (Inventory) *
                </Label>
                <Combobox
                  options={pharmaceuticals.map((p) => ({
                    value: p.PHAR_NAME,
                    label: p.PHAR_NAME
                  }))}
                  value={formData.medication}
                  onChange={(value) =>
                    setFormData({ ...formData, medication: value })
                  }
                  placeholder="Select pharmaceutical..."
                  searchPlaceholder="Search pharmaceuticals..."
                  emptyMessage="No pharmaceuticals found"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dosage & Schedule */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2 border-b border-border pb-2">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Dosage & Administration Regimen
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="dosage" className="label-hospital">
                  Dosage (Amount) *
                </Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) =>
                    setFormData({ ...formData, dosage: e.target.value })
                  }
                  required
                  placeholder="e.g., 500mg or 10ml"
                  className="input-hospital h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="frequency" className="label-hospital">
                  Frequency *
                </Label>
                <Input
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value })
                  }
                  required
                  placeholder="e.g., Twice daily after meals"
                  className="input-hospital h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="duration" className="label-hospital">
                  Duration *
                </Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  required
                  placeholder="e.g., 7 days or 2 weeks"
                  className="input-hospital h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="status" className="label-hospital">
                  Prescription Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="select-hospital h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="refillsRemaining" className="label-hospital">
                  Refills Allowed
                </Label>
                <Input
                  id="refillsRemaining"
                  type="number"
                  min="0"
                  value={formData.refillsRemaining}
                  onChange={(e) =>
                    setFormData({ ...formData, refillsRemaining: parseInt(e.target.value) || 0 })
                  }
                  className="input-hospital h-11"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Clinical Instructions & Notes */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2 border-b border-border pb-2">
              <FileText className="w-3.5 h-3.5 text-primary" />
              Special Patient Instructions / Notes
            </h3>

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="label-hospital">
                Instructions & Precautions
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="e.g. Take with a full glass of water. Avoid operating heavy machinery."
                rows={3}
                className="textarea-hospital"
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
              <CheckCircle className="w-4 h-4" />
              {loading ? 'Saving...' : prescription ? 'Update Prescription' : 'Create Prescription'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
