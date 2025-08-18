'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, User, FileText, Pill, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';

interface Prescription {
  PRES_ID: number;
  PRES_NUMBER: string;
  PRES_PAT_NUMBER: string;
  PRES_PAT_NAME: string;
  PRES_DOC_NUMBER: string;
  PRES_DOC_NAME: string;
  PRES_MEDICATION: string;
  PRES_DOSAGE: string;
  PRES_FREQUENCY: string;
  PRES_DURATION: string;
  PRES_DATE: string;
  PRES_STATUS: string;
  PRES_REFILLS_REMAINING: number;
  PRES_NOTES: string;
}

interface Props {
  prescription: Prescription | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PrescriptionsForm({ prescription, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Array<{
    PAT_NUMBER: string;
    PAT_FNAME: string;
    PAT_LNAME: string;
  }>>([]);
  const [doctors, setDoctors] = useState<Array<{
    DOC_NUMBER: string;
    DOC_FNAME: string;
    DOC_LNAME: string;
  }>>([]);
  const [pharmaceuticals, setPharmaceuticals] = useState<Array<{
    PHAR_ID: number;
    PHAR_NAME: string;
    PHAR_QTY: number;
  }>>([]);
  
  const [formData, setFormData] = useState({
    number: prescription?.PRES_NUMBER || '',
    patientNumber: prescription?.PRES_PAT_NUMBER || '',
    patientName: prescription?.PRES_PAT_NAME || '',
    doctorNumber: prescription?.PRES_DOC_NUMBER || '',
    doctorName: prescription?.PRES_DOC_NAME || '',
    medication: prescription?.PRES_MEDICATION || '',
    dosage: prescription?.PRES_DOSAGE || '',
    frequency: prescription?.PRES_FREQUENCY || '',
    duration: prescription?.PRES_DURATION || '',
    status: prescription?.PRES_STATUS || 'Active',
    refills: prescription?.PRES_REFILLS_REMAINING || 0,
    notes: prescription?.PRES_NOTES || '',
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    fetchPharmaceuticals();
  }, []);

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

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/doctors');
      if (response.ok) {
        const data = await response.json();
        setDoctors(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
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

  const handleDoctorChange = (docNumber: string) => {
    const doctor = doctors.find(d => d.DOC_NUMBER === docNumber);
    if (doctor) {
      setFormData({
        ...formData,
        doctorNumber: doctor.DOC_NUMBER,
        doctorName: `${doctor.DOC_FNAME} ${doctor.DOC_LNAME}`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = '/api/prescriptions';
      const method = prescription ? 'PUT' : 'POST';
      
      const body = prescription
        ? { id: prescription.PRES_ID, ...formData }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save prescription');

      toast.success(prescription ? 'Prescription updated successfully' : 'Prescription created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error('Failed to save prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key={prescription?.PRES_ID || 'new'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {prescription ? 'Edit Prescription' : 'Add Prescription'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient & Doctor Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              Patient & Doctor Information
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
                  disabled={!!prescription}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor">Prescribing Doctor *</Label>
                <Combobox
                  options={doctors.map((doctor) => ({
                    value: doctor.DOC_NUMBER,
                    label: `Dr. ${doctor.DOC_FNAME} ${doctor.DOC_LNAME} (${doctor.DOC_NUMBER})`
                  }))}
                  value={formData.doctorNumber}
                  onChange={handleDoctorChange}
                  placeholder="Select doctor"
                  searchPlaceholder="Search doctors..."
                  emptyMessage="No doctor found."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="select-hospital">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                    <SelectItem value="Active" className="text-slate-900 dark:text-white">Active</SelectItem>
                    <SelectItem value="Completed" className="text-slate-900 dark:text-white">Completed</SelectItem>
                    <SelectItem value="Cancelled" className="text-slate-900 dark:text-white">Cancelled</SelectItem>
                    <SelectItem value="Expired" className="text-slate-900 dark:text-white">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Medication Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">
              <Pill className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Medication Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="medication">Medication *</Label>
                <Combobox
                  options={pharmaceuticals.map((p) => ({
                    value: p.PHAR_NAME,
                    label: `${p.PHAR_NAME} (Stock: ${p.PHAR_QTY})`
                  }))}
                  value={formData.medication}
                  onChange={(value) => setFormData({ ...formData, medication: value })}
                  placeholder="Select medication from inventory..."
                  searchPlaceholder="Search pharmaceuticals..."
                  emptyMessage="No pharmaceuticals found"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  required
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  className="input-hospital"
                  placeholder="e.g., 500mg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Input
                  id="frequency"
                  required
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="input-hospital"
                  placeholder="e.g., 3 times daily"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="input-hospital"
                  placeholder="e.g., 7 days"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refills">Refills Remaining</Label>
                <Input
                  id="refills"
                  type="number"
                  min="0"
                  value={formData.refills}
                  onChange={(e) => setFormData({ ...formData, refills: parseInt(e.target.value) || 0 })}
                  className="input-hospital"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Additional Notes
            </h3>
            <div className="space-y-2">
              <Label htmlFor="notes">Prescription Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="textarea-hospital min-h-28"
                placeholder="Enter any additional instructions, warnings, or notes about this prescription..."
              />
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
              {prescription ? 'Update' : 'Create'} Prescription
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
