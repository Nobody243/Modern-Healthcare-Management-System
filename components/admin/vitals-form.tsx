'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Activity, User, Weight, Thermometer, HeartPulse, Wind, Droplets, UserCog } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent key={vitals?.VIT_ID || 'new'} className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            {vitals ? 'Edit Vital Signs' : 'Record Vital Signs'}
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Record patient vital signs and measurements
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-sky-600 dark:text-sky-400" />
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
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">
              <Activity className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              Vital Measurements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bodyTemp" className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-rose-500" />
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
                  <HeartPulse className="w-4 h-4 text-red-500" />
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
                  <Wind className="w-4 h-4 text-blue-500" />
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
                <Label htmlFor="bloodPressure" className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-purple-500" />
                  Blood Pressure *
                </Label>
                <Input
                  id="bloodPressure"
                  required
                  value={formData.bloodPressure}
                  onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                  className="input-hospital"
                  placeholder="120/80"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="oxygenSat" className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-500" />
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
                  <Weight className="w-4 h-4 text-amber-500" />
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

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={loading}
              className="border-slate-300 dark:border-slate-600"
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
