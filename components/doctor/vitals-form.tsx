'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { calculateMAP, evaluateBloodPressure } from '@/lib/vitals-evaluator';

interface Vital {
  VIT_ID: number;
  VIT_PAT_NUMBER: string;
  VIT_WEIGHT: number;
  VIT_BODYTEMP: number;
  VIT_BLOOD_PRESSURE: string;
  VIT_HEARTPULSE: number;
  VIT_RESPIRATION: number;
  VIT_OXYGEN_SAT: number;
  VIT_RECORDED_DATE: string;
}

interface Patient {
  PAT_NUMBER: string;
  PAT_FNAME: string;
  PAT_LNAME: string;
}

interface VitalsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  vital?: Vital;
  doctorNumber: string;
}

export function VitalsForm({
  open,
  onOpenChange,
  onSuccess,
  vital,
  doctorNumber,
}: VitalsFormProps) {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    patNumber: '',
    weight: '',
    bodyTemp: '',
    bloodPressure: '',
    heartPulse: '',
    respiration: '',
    oxygenSat: '',
    recordedDate: new Date().toISOString().split('T')[0],
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
      if (vital) {
        setFormData({
          patNumber: vital.VIT_PAT_NUMBER || '',
          weight: String(vital.VIT_WEIGHT || ''),
          bodyTemp: String(vital.VIT_BODYTEMP || ''),
          bloodPressure: vital.VIT_BLOOD_PRESSURE || '',
          heartPulse: String(vital.VIT_HEARTPULSE || ''),
          respiration: String(vital.VIT_RESPIRATION || ''),
          oxygenSat: String(vital.VIT_OXYGEN_SAT || ''),
          recordedDate: vital.VIT_RECORDED_DATE?.split('T')[0] || new Date().toISOString().split('T')[0],
        });
      } else {
        setFormData({
          patNumber: '',
          weight: '',
          bodyTemp: '',
          bloodPressure: '',
          heartPulse: '',
          respiration: '',
          oxygenSat: '',
          recordedDate: new Date().toISOString().split('T')[0],
        });
      }
    }
  }, [open, vital, fetchPatients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/vitals';
      const method = vital ? 'PUT' : 'POST';

      const selectedPatient = patients.find(p => p.PAT_NUMBER === formData.patNumber);
      const patientName = selectedPatient ? `${selectedPatient.PAT_FNAME} ${selectedPatient.PAT_LNAME}` : '';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientNumber: formData.patNumber,
          patientName: patientName,
          weight: formData.weight,
          bodyTemp: formData.bodyTemp,
          bloodPressure: formData.bloodPressure,
          heartPulse: formData.heartPulse,
          respiration: formData.respiration,
          oxygenSat: formData.oxygenSat,
          recordedBy: doctorNumber,
          ...(vital ? { id: vital.VIT_ID } : {}),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save vitals');
      }

      onSuccess();
      toast.success(vital ? 'Vitals updated successfully' : 'Vitals recorded successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving vitals:', error);
      toast.error((error as Error).message || 'Failed to save vitals');
    } finally {
      setLoading(false);
    }
  };

  const patientOptions = patients.map((p) => ({
    value: p.PAT_NUMBER,
    label: `${p.PAT_FNAME} ${p.PAT_LNAME} (${p.PAT_NUMBER})`,
  }));

  const liveMap = calculateMAP(formData.bloodPressure);
  const liveBpEval = evaluateBloodPressure(formData.bloodPressure);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border border-border">
        <DialogHeader>
          <DialogTitle>
            {vital ? 'Edit Vitals' : 'Record Vitals'}
          </DialogTitle>
          <DialogDescription>
            {vital
              ? 'Update patient vital signs (Press Ctrl+Enter to save)'
              : 'Record vital signs for your patient (Press Ctrl+Enter to save)'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4">
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
                disabled={!!vital}
              />
            </div>

            <div>
              <Label htmlFor="weight">Weight (lbs) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                required
                placeholder="e.g., 155"
              />
            </div>

            <div>
              <Label htmlFor="bodyTemp">Body Temperature (°F) *</Label>
              <Input
                id="bodyTemp"
                type="number"
                step="0.1"
                min="90"
                max="110"
                value={formData.bodyTemp}
                onChange={(e) =>
                  setFormData({ ...formData, bodyTemp: e.target.value })
                }
                required
                placeholder="e.g., 98.6"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="bloodPressure">Blood Pressure *</Label>
                {formData.bloodPressure.includes('/') && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${liveBpEval.badgeClass}`}>
                    {liveBpEval.label}
                  </span>
                )}
              </div>
              <Input
                id="bloodPressure"
                value={formData.bloodPressure}
                onChange={(e) =>
                  setFormData({ ...formData, bloodPressure: e.target.value })
                }
                required
                placeholder="e.g., 120/80"
              />
              {liveMap && (
                <p className="text-[11px] font-mono text-cyan-700 dark:text-cyan-300 font-semibold mt-1">
                  Est. MAP: ~{liveMap} mmHg
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="heartPulse">Heart Pulse (bpm) *</Label>
              <Input
                id="heartPulse"
                type="number"
                min="30"
                max="220"
                value={formData.heartPulse}
                onChange={(e) =>
                  setFormData({ ...formData, heartPulse: e.target.value })
                }
                required
                placeholder="e.g., 72"
              />
            </div>

            <div>
              <Label htmlFor="respiration">Respiration Rate (breaths/min) *</Label>
              <Input
                id="respiration"
                type="number"
                min="5"
                max="60"
                value={formData.respiration}
                onChange={(e) =>
                  setFormData({ ...formData, respiration: e.target.value })
                }
                required
                placeholder="e.g., 16"
              />
            </div>

            <div>
              <Label htmlFor="oxygenSat">Oxygen Saturation (%) *</Label>
              <Input
                id="oxygenSat"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.oxygenSat}
                onChange={(e) =>
                  setFormData({ ...formData, oxygenSat: e.target.value })
                }
                required
                placeholder="e.g., 98"
              />
            </div>

            <div>
              <Label htmlFor="recordedDate">Recorded Date *</Label>
              <Input
                id="recordedDate"
                type="date"
                value={formData.recordedDate}
                onChange={(e) =>
                  setFormData({ ...formData, recordedDate: e.target.value })
                }
                required
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs border border-border font-mono">Ctrl+Enter</kbd> to submit
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : vital ? 'Update' : 'Record'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
