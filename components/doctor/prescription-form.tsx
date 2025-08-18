'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/ui/combobox';
import { Loader2 } from 'lucide-react';
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

interface Prescription {
  PRES_ID: number;
  PRES_NUMBER: string;
  PRES_PAT_NUMBER: string;
  PRES_MEDICATION: string;
  PRES_DOSAGE: string;
  PRES_FREQUENCY: string;
  PRES_DURATION: string;
  PRES_STATUS: string;
  PRES_REFILLS_REMAINING: number;
  PRES_NOTES: string;
}

interface Patient {
  PAT_NUMBER: string;
  PAT_FNAME: string;
  PAT_LNAME: string;
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
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [pharmaceuticals, setPharmaceuticals] = useState<Array<{
    PHAR_ID: number;
    PHAR_NAME: string;
    PHAR_QTY: number;
  }>>([]);
  const [formData, setFormData] = useState({
    patNumber: '',
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    status: 'Active',
    refillsRemaining: '0',
    notes: '',
  });

  useEffect(() => {
    if (open) {
      fetchPatients();
      fetchPharmaceuticals();
      if (prescription) {
        setFormData({
          patNumber: prescription.PRES_PAT_NUMBER || '',
          medication: prescription.PRES_MEDICATION || '',
          dosage: prescription.PRES_DOSAGE || '',
          frequency: prescription.PRES_FREQUENCY || '',
          duration: prescription.PRES_DURATION || '',
          status: prescription.PRES_STATUS || 'Active',
          refillsRemaining: String(prescription.PRES_REFILLS_REMAINING || 0),
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
          refillsRemaining: '0',
          notes: '',
        });
      }
    }
  }, [open, prescription]);

  const fetchPatients = useCallback(async () => {
    if (!doctorNumber) return;
    try {
      const response = await fetch(`/api/doctors/${doctorNumber}/patients`);
      const data = await response.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  }, [doctorNumber]);

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

      // Get patient name from selected patient
      const selectedPatient = patients.find(p => p.PAT_NUMBER === formData.patNumber);
      const patientName = selectedPatient ? `${selectedPatient.PAT_FNAME} ${selectedPatient.PAT_LNAME}` : '';

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <DialogHeader>
          <DialogTitle>
            {prescription ? 'Edit Prescription' : 'Create Prescription'}
          </DialogTitle>
          <DialogDescription>
            {prescription
              ? 'Update prescription details'
              : 'Add a new prescription for your patient'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="patNumber">Patient *</Label>
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

            <div className="col-span-2">
              <Label htmlFor="medication">Medication *</Label>
              <Combobox
                options={pharmaceuticals.map((p) => ({
                  value: p.PHAR_NAME,
                  label: p.PHAR_NAME
                }))}
                value={formData.medication}
                onChange={(value) =>
                  setFormData({ ...formData, medication: value })
                }
                placeholder="Select medication from inventory..."
                searchPlaceholder="Search pharmaceuticals..."
                emptyMessage="No pharmaceuticals found"
              />
            </div>

            <div>
              <Label htmlFor="dosage">Dosage *</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) =>
                  setFormData({ ...formData, dosage: e.target.value })
                }
                required
                placeholder="e.g., 500mg"
              />
            </div>

            <div>
              <Label htmlFor="frequency">Frequency *</Label>
              <Input
                id="frequency"
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
                required
                placeholder="e.g., Twice daily"
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                required
                placeholder="e.g., 7 days"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="refillsRemaining">Refills Remaining</Label>
              <Input
                id="refillsRemaining"
                type="number"
                min="0"
                value={formData.refillsRemaining}
                onChange={(e) =>
                  setFormData({ ...formData, refillsRemaining: e.target.value })
                }
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Additional instructions or notes..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
              {loading ? 'Saving...' : prescription ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
