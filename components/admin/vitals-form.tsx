'use client';
import { useState, useEffect } from 'react';
import { Loader2, Activity, User, Weight, Thermometer, HeartPulse, Wind, Droplets } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { calculateMAP, evaluateBloodPressure } from '@/lib/vitals-evaluator';

interface Vitals {
  VIT_ID: number;
  VIT_PAT_NUMBER: string;
  VIT_PAT_NAME: string;
  VIT_WEIGHT: number;
  VIT_BODYTEMP: number;
  VIT_BLOOD_PRESSURE: string;
  VIT_HEARTPULSE: number;
  VIT_RESPIRATION: number;
  VIT_OXYGEN_SAT: number;
  VIT_RECORDED_BY: string;
  VIT_RECORDED_DATE: string;
}

interface Props {
  vitals: Vitals | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VitalsForm({ vitals, open, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Array<{
    PAT_NUMBER: string;
    PAT_FNAME: string;
    PAT_LNAME: string;
  }>>([]);
  
  const [formData, setFormData] = useState({
    patientNumber: vitals?.VIT_PAT_NUMBER || '',
    patientName: vitals?.VIT_PAT_NAME || '',
    weight: vitals?.VIT_WEIGHT?.toString() || '',
    bodyTemp: vitals?.VIT_BODYTEMP?.toString() || '',
    bloodPressure: vitals?.VIT_BLOOD_PRESSURE || '',
    heartPulse: vitals?.VIT_HEARTPULSE?.toString() || '',
    respiration: vitals?.VIT_RESPIRATION?.toString() || '',
    oxygenSat: vitals?.VIT_OXYGEN_SAT?.toString() || '',
    recordedBy: vitals?.VIT_RECORDED_BY || '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (vitals) {
      setFormData({
        patientNumber: vitals.VIT_PAT_NUMBER || '',
        patientName: vitals.VIT_PAT_NAME || '',
        weight: vitals.VIT_WEIGHT?.toString() || '',
        bodyTemp: vitals.VIT_BODYTEMP?.toString() || '',
        bloodPressure: vitals.VIT_BLOOD_PRESSURE || '',
        heartPulse: vitals.VIT_HEARTPULSE?.toString() || '',
        respiration: vitals.VIT_RESPIRATION?.toString() || '',
        oxygenSat: vitals.VIT_OXYGEN_SAT?.toString() || '',
        recordedBy: vitals.VIT_RECORDED_BY || '',
      });
    }
  }, [vitals]);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      if (response.ok) {
        const data = await response.json();
        setPatients(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handlePatientChange = (patNumber: string) => {
    const patient = patients.find(p => p.PAT_NUMBER === patNumber);
    if (patient) {
      setFormData({
        ...formData,
        patientNumber: patient.PAT_NUMBER,
        patientName: `${patient.PAT_FNAME} ${patient.PAT_LNAME}`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = '/api/vitals';
      const method = vitals ? 'PUT' : 'POST';
      
      const body = vitals
        ? { id: vitals.VIT_ID, ...formData }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save vitals');
      }

      toast.success(vitals ? 'Vitals updated successfully' : 'Vitals recorded successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving vitals:', error);
      toast.error(error.message || 'Failed to save vitals');
    } finally {
      setLoading(false);
    }
  };

  const liveMap = calculateMAP(formData.bloodPressure);
  const liveBpEval = evaluateBloodPressure(formData.bloodPressure);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent key={vitals?.VIT_ID || 'new'} className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-heading flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            {vitals ? 'Edit Vital Signs' : 'Record Vital Signs'}
          </DialogTitle>
          <DialogDescription className="text-muted">
            Record patient vital signs and measurements (Press Ctrl+Enter to save)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6 py-4">
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-heading flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient *</Label>
                <Combobox
                  options={patients.map((patient) => ({
                    value: patient.PAT_NUMBER,
                    label: `${patient.PAT_FNAME} ${patient.PAT_LNAME} (${patient.PAT_NUMBER})`
                  }))}
                  value={formData.patientNumber}
                  onChange={handlePatientChange}
                  placeholder="Select patient"
                  searchPlaceholder="Search patients..."
                  emptyMessage="No patient found."
                  disabled={!!vitals}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recordedBy">Recorded By *</Label>
                <Input
                  id="recordedBy"
                  required
                  value={formData.recordedBy}
                  onChange={(e) => setFormData({ ...formData, recordedBy: e.target.value })}
                  className="input-hospital"
                  placeholder="Staff name or ID"
                />
              </div>
            </div>
          </div>

          {/* Vital Measurements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-heading flex items-center gap-2 border-t border-border pt-4">
              <Activity className="w-5 h-5 text-primary" />
              Vital Measurements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bodyTemp" className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-kpi-danger" />
                  Body Temperature (°F) *
                </Label>
                <Input
                  id="bodyTemp"
                  type="number"
                  step="0.1"
                  min="90"
                  max="110"
                  required
                  value={formData.bodyTemp}
                  onChange={(e) => setFormData({ ...formData, bodyTemp: e.target.value })}
                  className="input-hospital"
                  placeholder="98.6"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heartPulse" className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-kpi-danger" />
                  Heart Pulse (bpm) *
                </Label>
                <Input
                  id="heartPulse"
                  type="number"
                  min="30"
                  max="220"
                  required
                  value={formData.heartPulse}
                  onChange={(e) => setFormData({ ...formData, heartPulse: e.target.value })}
                  className="input-hospital"
                  placeholder="72"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="respiration" className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-primary" />
                  Respiration (breaths/min) *
                </Label>
                <Input
                  id="respiration"
                  type="number"
                  min="5"
                  max="60"
                  required
                  value={formData.respiration}
                  onChange={(e) => setFormData({ ...formData, respiration: e.target.value })}
                  className="input-hospital"
                  placeholder="16"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="bloodPressure" className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-kpi-info" />
                    Blood Pressure *
                  </Label>
                  {formData.bloodPressure.includes('/') && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${liveBpEval.badgeClass}`}>
                      {liveBpEval.label}
                    </span>
                  )}
                </div>
                <Input
                  id="bloodPressure"
                  required
                  value={formData.bloodPressure}
                  onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                  className="input-hospital"
                  placeholder="120/80"
                />
                {liveMap && (
                  <p className="text-[11px] font-mono text-cyan-700 dark:text-cyan-300 font-semibold mt-1">
                    Est. MAP: ~{liveMap} mmHg
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="oxygenSat" className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Oxygen Saturation (%) *
                </Label>
                <Input
                  id="oxygenSat"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                  value={formData.oxygenSat}
                  onChange={(e) => setFormData({ ...formData, oxygenSat: e.target.value })}
                  className="input-hospital"
                  placeholder="98"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-kpi-warning" />
                  Weight (lbs) *
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="input-hospital"
                  placeholder="150"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs border border-border font-mono">Ctrl+Enter</kbd> to submit
            </span>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                disabled={loading}
                className="btn-secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {vitals ? 'Update' : 'Record'} Vitals
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
