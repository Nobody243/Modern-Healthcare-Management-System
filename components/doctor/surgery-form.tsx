'use client';
import { useState, useEffect, useCallback } from 'react';
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

interface Surgery {
  SURG_ID: number;
  SURG_PAT_NUMBER: string;
  SURG_DATE: string;
  SURG_TYPE: string;
  SURG_STATUS: string;
  SURG_DURATION: string;
  SURG_NOTES: string;
}

interface Patient {
  PAT_NUMBER: string;
  PAT_FNAME: string;
  PAT_LNAME: string;
}

interface SurgeryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  surgery?: Surgery;
  doctorNumber: string;
}

export function SurgeryForm({
  open,
  onOpenChange,
  onSuccess,
  surgery,
  doctorNumber,
}: SurgeryFormProps) {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    patNumber: '',
    date: new Date().toISOString().split('T')[0],
    type: '',
    status: 'Scheduled',
    duration: '',
    notes: '',
  });

  useEffect(() => {
    if (open) {
      fetchPatients();
      if (surgery) {
        setFormData({
          patNumber: surgery.SURG_PAT_NUMBER || '',
          date: surgery.SURG_DATE?.split('T')[0] || new Date().toISOString().split('T')[0],
          type: surgery.SURG_TYPE || '',
          status: surgery.SURG_STATUS || 'Scheduled',
          duration: surgery.SURG_DURATION || '',
          notes: surgery.SURG_NOTES || '',
        });
      } else {
        setFormData({
          patNumber: '',
          date: new Date().toISOString().split('T')[0],
          type: '',
          status: 'Scheduled',
          duration: '',
          notes: '',
        });
      }
    }
  }, [open, surgery]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/surgery';
      const method = surgery ? 'PUT' : 'POST';

      // Find the selected patient
      const selectedPatient = patients.find(p => p.PAT_NUMBER === formData.patNumber);
      
      // Get doctor info
      const doctorResponse = await fetch('/api/doctors/me');
      const doctor = await doctorResponse.json();

      const payload = {
        patientNumber: formData.patNumber,
        patientName: selectedPatient ? `${selectedPatient.PAT_FNAME} ${selectedPatient.PAT_LNAME}` : '',
        doctorNumber: doctorNumber,
        doctorName: `${doctor.DOC_FNAME} ${doctor.DOC_LNAME}`,
        date: formData.date,
        type: formData.type,
        status: formData.status,
        duration: formData.duration,
        notes: formData.notes,
        ...(surgery ? { id: surgery.SURG_ID } : {}),
      };

      console.log('Surgery form submitting payload:', payload);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('Surgery API Error:', text);
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = { error: text || 'Failed to save surgery' };
        }
        throw new Error(errorData.error || 'Failed to save surgery');
      }

      toast.success(surgery ? 'Surgery updated successfully' : 'Surgery scheduled successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving surgery:', error);
      toast.error((error as Error).message || 'Failed to save surgery');
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
            {surgery ? 'Edit Surgery' : 'Schedule Surgery'}
          </DialogTitle>
          <DialogDescription>
            {surgery
              ? 'Update surgery details'
              : 'Schedule a new surgery for your patient'}
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
                disabled={!!surgery}
              />
            </div>

            <div>
              <Label htmlFor="date">Surgery Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
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
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="type">Surgery Type *</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
                placeholder="e.g., Appendectomy"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="e.g., 2 hours"
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
                placeholder="Additional notes or observations..."
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
              {loading ? 'Saving...' : surgery ? 'Update' : 'Schedule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
