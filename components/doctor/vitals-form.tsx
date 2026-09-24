'use client';
import { useState, useEffect } from 'react';
import { Activity, HeartPulse, User, Calendar, CheckCircle } from 'lucide-react';
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

interface Patient {
  PAT_NUMBER: string;
  PAT_FNAME: string;
  PAT_LNAME: string;
}

interface Vital {
  VIT_ID: number;
  VIT_PAT_NUMBER: string;
  VIT_PAT_NAME?: string;
  VIT_WEIGHT: number | string;
  VIT_BODYTEMP: number | string;
  VIT_BLOOD_PRESSURE: string;
  VIT_HEARTPULSE: number | string;
  VIT_RESPIRATION: number | string;
  VIT_OXYGEN_SAT: number | string;
  VIT_RECORDED_DATE: string;
  VIT_RECORDED_TIME?: string;
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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    patNumber: vital?.VIT_PAT_NUMBER || '',
    weight: vital?.VIT_WEIGHT || '',
    bodyTemp: vital?.VIT_BODYTEMP || '',
    bloodPressure: vital?.VIT_BLOOD_PRESSURE || '',
    heartPulse: vital?.VIT_HEARTPULSE || '',
    respiration: vital?.VIT_RESPIRATION || '',
    oxygenSat: vital?.VIT_OXYGEN_SAT || '',
    recordedDate: vital?.VIT_RECORDED_DATE
      ? new Date(vital.VIT_RECORDED_DATE).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (vital) {
      setFormData({
        patNumber: vital.VIT_PAT_NUMBER || '',
        weight: vital.VIT_WEIGHT || '',
        bodyTemp: vital.VIT_BODYTEMP || '',
        bloodPressure: vital.VIT_BLOOD_PRESSURE || '',
        heartPulse: vital.VIT_HEARTPULSE || '',
        respiration: vital.VIT_RESPIRATION || '',
        oxygenSat: vital.VIT_OXYGEN_SAT || '',
        recordedDate: vital.VIT_RECORDED_DATE
          ? new Date(vital.VIT_RECORDED_DATE).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
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
  }, [vital, open]);

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
      const url = '/api/vitals';
      const method = vital ? 'PUT' : 'POST';

      const selectedPatient = patients.find(
        (p) => p.PAT_NUMBER === formData.patNumber
      );
      const patientName = selectedPatient
        ? `${selectedPatient.PAT_FNAME} ${selectedPatient.PAT_LNAME}`
        : vital?.VIT_PAT_NAME || '';

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
          recordedDate: formData.recordedDate,
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border border-border p-6 sm:p-8 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-heading">
                {vital ? 'Edit Vital Telemetry' : 'Record Patient Vital Signs'}
              </DialogTitle>
              <DialogDescription className="text-muted text-xs sm:text-sm mt-0.5">
                {vital
                  ? 'Update physiological telemetry readings and vital statistics'
                  : 'Log patient vital parameters including blood pressure, pulse, and oxygenation'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6 pt-4">
          {/* Section 1: Patient Selection & Timestamp */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2 border-b border-border pb-2">
              <User className="w-3.5 h-3.5 text-primary" />
              Patient & Observation Date
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
                  disabled={!!vital}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="recordedDate" className="label-hospital">
                  Observation Date *
                </Label>
                <Input
                  id="recordedDate"
                  type="date"
                  value={formData.recordedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, recordedDate: e.target.value })
                  }
                  required
                  className="input-hospital h-11"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Physiological Measurements */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2 border-b border-border pb-2">
              <Activity className="w-3.5 h-3.5 text-primary" />
              Vital Sign Telemetry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bloodPressure" className="label-hospital">
                    Blood Pressure (mmHg) *
                  </Label>
                  {formData.bloodPressure.includes('/') && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${liveBpEval.badgeClass}`}>
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
                  className="input-hospital h-11"
                />
                {liveMap && (
                  <p className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    Est. MAP: ~{liveMap} mmHg
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="heartPulse" className="label-hospital">
                  Heart Pulse (bpm) *
                </Label>
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
                  className="input-hospital h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="bodyTemp" className="label-hospital">
                  Body Temp (°F) *
                </Label>
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
                  className="input-hospital h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="oxygenSat" className="label-hospital">
                  Oxygen Saturation (%) *
                </Label>
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
                  className="input-hospital h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="respiration" className="label-hospital">
                  Respiration (breaths/min) *
                </Label>
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
                  className="input-hospital h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="weight" className="label-hospital">
                  Weight (lbs) *
                </Label>
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
                  className="input-hospital h-11"
                />
              </div>
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
                {loading ? 'Saving...' : vital ? 'Update Vitals' : 'Record Vitals'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
