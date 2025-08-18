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

interface LabTest {
  LAB_ID: number;
  LAB_PAT_NUMBER: string;
  LAB_PAT_TESTS: string;
  LAB_PAT_RESULTS: string;
  LAB_DATE_REC: string;
}

interface Patient {
  PAT_NUMBER: string;
  PAT_FNAME: string;
  PAT_LNAME: string;
  PAT_AILMENT?: string;
}

interface LaboratoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  labTest?: LabTest;
  doctorNumber: string;
}

export function LaboratoryForm({
  open,
  onOpenChange,
  onSuccess,
  labTest,
  doctorNumber,
}: LaboratoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    patNumber: '',
    patTests: '',
    patResults: '',
    dateRec: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (open) {
      fetchPatients();
      if (labTest) {
        setFormData({
          patNumber: labTest.LAB_PAT_NUMBER || '',
          patTests: labTest.LAB_PAT_TESTS || '',
          patResults: labTest.LAB_PAT_RESULTS || '',
          dateRec: labTest.LAB_DATE_REC?.split('T')[0] || new Date().toISOString().split('T')[0],
        });
      } else {
        setFormData({
          patNumber: '',
          patTests: '',
          patResults: '',
          dateRec: new Date().toISOString().split('T')[0],
        });
      }
    }
  }, [open, labTest]);

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
      const url = '/api/laboratory';
      const method = labTest ? 'PUT' : 'POST';

      // Get patient details from selected patient
      const selectedPatient = patients.find(p => p.PAT_NUMBER === formData.patNumber);
      const patientName = selectedPatient ? `${selectedPatient.PAT_FNAME} ${selectedPatient.PAT_LNAME}` : '';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientNumber: formData.patNumber,
          patientName: patientName,
          patientAilment: selectedPatient?.PAT_AILMENT || '',
          tests: formData.patTests,
          results: formData.patResults,
          doctorNumber: doctorNumber,
          status: 'Pending',
          ...(labTest ? { id: labTest.LAB_ID } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save lab test');
      }

      onSuccess();
      toast.success(labTest ? 'Lab test updated successfully' : 'Lab test ordered successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving lab test:', error);
      toast.error((error as Error).message || 'Failed to save lab test');
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
            {labTest ? 'Edit Lab Test' : 'Order Lab Test'}
          </DialogTitle>
          <DialogDescription>
            {labTest
              ? 'Update laboratory test details'
              : 'Order a new laboratory test for your patient'}
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
                disabled={!!labTest}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="patTests">Test(s) Ordered *</Label>
              <Textarea
                id="patTests"
                value={formData.patTests}
                onChange={(e) =>
                  setFormData({ ...formData, patTests: e.target.value })
                }
                required
                placeholder="e.g., Complete Blood Count, Lipid Panel"
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="patResults">Test Results</Label>
              <Textarea
                id="patResults"
                value={formData.patResults}
                onChange={(e) =>
                  setFormData({ ...formData, patResults: e.target.value })
                }
                placeholder="Enter results when available..."
                rows={4}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="dateRec">Date Recorded *</Label>
              <Input
                id="dateRec"
                type="date"
                value={formData.dateRec}
                onChange={(e) =>
                  setFormData({ ...formData, dateRec: e.target.value })
                }
                required
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
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              {loading ? 'Saving...' : labTest ? 'Update' : 'Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
