'use client';
import { useState, useEffect, useCallback } from 'react';
import { FlaskConical, User, Calendar, FileText, CheckCircle } from 'lucide-react';
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
  }, [open, labTest, fetchPatients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/laboratory';
      const method = labTest ? 'PUT' : 'POST';

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
          status: formData.patResults ? 'Completed' : 'Pending',
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border border-border p-6 sm:p-8 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-heading">
                {labTest ? 'Edit Laboratory Requisition' : 'Order Diagnostic Lab Test'}
              </DialogTitle>
              <DialogDescription className="text-muted text-xs sm:text-sm mt-0.5">
                {labTest
                  ? 'Update laboratory order, specimens, and pathology findings'
                  : 'Order new pathology, hematology, or diagnostic panel for your patient'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6 pt-4">
          {/* Section 1: Patient & Date */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2 border-b border-border pb-2">
              <User className="w-3.5 h-3.5 text-primary" />
              Patient & Order Schedule
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
                  disabled={!!labTest}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dateRec" className="label-hospital">
                  Requisition Date *
                </Label>
                <Input
                  id="dateRec"
                  type="date"
                  value={formData.dateRec}
                  onChange={(e) =>
                    setFormData({ ...formData, dateRec: e.target.value })
                  }
                  required
                  className="input-hospital h-11"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Tests & Findings */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2 border-b border-border pb-2">
              <FileText className="w-3.5 h-3.5 text-primary" />
              Diagnostic Test Panel & Findings
            </h3>

            <div className="space-y-1.5">
              <Label htmlFor="patTests" className="label-hospital">
                Test(s) Ordered *
              </Label>
              <Textarea
                id="patTests"
                value={formData.patTests}
                onChange={(e) =>
                  setFormData({ ...formData, patTests: e.target.value })
                }
                required
                placeholder="e.g., Complete Blood Count (CBC), Comprehensive Metabolic Panel (CMP), Lipid Profile"
                rows={3}
                className="textarea-hospital"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="patResults" className="label-hospital">
                Diagnostic Results & Pathology Report
              </Label>
              <Textarea
                id="patResults"
                value={formData.patResults}
                onChange={(e) =>
                  setFormData({ ...formData, patResults: e.target.value })
                }
                placeholder="Enter quantitative laboratory values, reference ranges, and clinical interpretation when ready..."
                rows={4}
                className="textarea-hospital"
              />
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-muted hidden sm:inline">
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs border border-border font-mono">Ctrl+Enter</kbd> to save
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
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
                {loading ? 'Saving...' : labTest ? 'Update Test' : 'Order Lab Test'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
