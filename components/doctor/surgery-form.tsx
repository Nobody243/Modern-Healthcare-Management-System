'use client';
import { useState, useEffect } from 'react';
import { Scissors, User, Calendar, Clock, FileText, CheckCircle } from 'lucide-react';
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

interface Surgery {
  SURG_ID: number;
  SURG_NUMBER: string;
  SURG_PAT_NUMBER: string;
  SURG_PAT_NAME?: string;
  SURG_TYPE: string;
  SURG_DATE: string;
  SURG_DURATION?: string;
  SURG_STATUS: string;
  SURG_NOTES?: string;
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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    patNumber: surgery?.SURG_PAT_NUMBER || '',
    type: surgery?.SURG_TYPE || '',
    date: surgery?.SURG_DATE ? new Date(surgery.SURG_DATE).toISOString().split('T')[0] : '',
    duration: surgery?.SURG_DURATION || '',
    status: surgery?.SURG_STATUS || 'Scheduled',
    notes: surgery?.SURG_NOTES || '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (surgery) {
      setFormData({
        patNumber: surgery.SURG_PAT_NUMBER || '',
        type: surgery.SURG_TYPE || '',
        date: surgery.SURG_DATE ? new Date(surgery.SURG_DATE).toISOString().split('T')[0] : '',
        duration: surgery.SURG_DURATION || '',
        status: surgery.SURG_STATUS || 'Scheduled',
        notes: surgery.SURG_NOTES || '',
      });
    } else {
      setFormData({
        patNumber: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        status: 'Scheduled',
        notes: '',
      });
    }
  }, [surgery, open]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/surgery';
      const method = surgery ? 'PUT' : 'POST';

      const selectedPatient = patients.find(
        (p) => p.PAT_NUMBER === formData.patNumber
      );
      const patientName = selectedPatient
        ? `${selectedPatient.PAT_FNAME} ${selectedPatient.PAT_LNAME}`
        : surgery?.SURG_PAT_NAME || '';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientNumber: formData.patNumber,
          patientName: patientName,
          type: formData.type,
          date: formData.date,
          duration: formData.duration,
          status: formData.status,
          notes: formData.notes,
          doctorNumber: doctorNumber,
          ...(surgery ? { id: surgery.SURG_ID } : {}),
        }),
      });

      if (!response.ok) {
        const text = await response.text();
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border border-border p-6 sm:p-8 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-heading">
                {surgery ? 'Edit Surgical Procedure' : 'Schedule Surgical Procedure'}
              </DialogTitle>
              <DialogDescription className="text-muted text-xs sm:text-sm mt-0.5">
                {surgery
                  ? 'Update surgical scheduling and operation parameters'
                  : 'Schedule an operative procedure and theater booking for your patient'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Section 1: Patient & Procedure Type */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2 border-b border-border pb-2">
              <User className="w-3.5 h-3.5 text-primary" />
              Patient & Procedure Classification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="patNumber" className="label-hospital">
                  Target Patient *
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
                  disabled={!!surgery}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="type" className="label-hospital">
                  Surgery Type / Procedure *
                </Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  required
                  placeholder="e.g., Appendectomy, Cardiac Angioplasty"
                  className="input-hospital h-11"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Scheduling & Theater Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2 border-b border-border pb-2">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Operation Theater & Scheduling
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="date" className="label-hospital">
                  Surgery Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                  className="input-hospital h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="duration" className="label-hospital">
                  Est. Duration
                </Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="e.g., 2 hours 30 mins"
                  className="input-hospital h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status" className="label-hospital">
                  Procedure Status
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
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 3: Clinical Notes */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2 border-b border-border pb-2">
              <FileText className="w-3.5 h-3.5 text-primary" />
              Surgical Notes & Pre-Op Instructions
            </h3>

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="label-hospital">
                Pre-Op Preparation & Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Pre-operative observations, anesthesia requirements, post-op instructions..."
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
              {loading ? 'Saving...' : surgery ? 'Update Procedure' : 'Schedule Procedure'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
