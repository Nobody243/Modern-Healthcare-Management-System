'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Combobox } from '@/components/ui/combobox';

export interface MedicalRecord {
  MDR_ID: number;
  MDR_NUMBER: string;
  MDR_PAT_NAME: string;
  MDR_PAT_ADR: string;
  MDR_PAT_AGE: number | string;
  MDR_PAT_AILMENT: string;
  MDR_PAT_NUMBER: string;
  MDR_DOC_NUMBER?: string;
  MDR_PAT_PRESCR?: string;
  MDR_DIAGNOSIS?: string;
  MDR_TREATMENT_PLAN?: string;
  MDR_DATE_REC?: string;
  PRES_MEDICATION?: string;
  PRES_DOSAGE?: string;
  PRES_FREQUENCY?: string;
}

interface Props {
  record: MedicalRecord | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RecordsForm({ record, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Array<{
    PAT_NUMBER: string;
    PAT_FNAME: string;
    PAT_LNAME: string;
    PAT_ADR: string;
    PAT_AGE: number;
  }>>([]);
  const [doctors, setDoctors] = useState<Array<{
    DOC_NUMBER: string;
    DOC_FNAME: string;
    DOC_LNAME: string;
  }>>([]);
  const [prescriptions, setPrescriptions] = useState<Array<{
    PRES_ID: number;
    PRES_NUMBER: string;
    PRES_MEDICATION: string;
    PRES_DOSAGE: string;
    PRES_FREQUENCY: string;
    PRES_DURATION: string;
    PRES_NOTES: string;
  }>>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<{
    PRES_MEDICATION: string;
    PRES_DOSAGE: string;
    PRES_FREQUENCY: string;
    PRES_DURATION: string;
    PRES_NOTES: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    number: record?.MDR_NUMBER || '',
    patientNumber: record?.MDR_PAT_NUMBER || '',
    patientName: record?.MDR_PAT_NAME || '',
    patientAddress: record?.MDR_PAT_ADR || '',
    patientAge: record?.MDR_PAT_AGE?.toString() || '',
    patientAilment: record?.MDR_PAT_AILMENT || '',
    doctorNumber: record?.MDR_DOC_NUMBER || '',
    prescription: record?.MDR_PAT_PRESCR || '',
    diagnosis: record?.MDR_DIAGNOSIS || '',
    treatmentPlan: record?.MDR_TREATMENT_PLAN || '',
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
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

  const fetchPrescriptions = async (patNumber: string) => {
    try {
      console.log('Fetching prescriptions for patient:', patNumber);
      const response = await fetch(`/api/prescriptions?patientNumber=${patNumber}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Prescriptions received:', data);
        setPrescriptions(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch prescriptions:', response.status);
        setPrescriptions([]);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      setPrescriptions([]);
    }
  };

  const handlePatientChange = (patNumber: string) => {
    const patient = patients.find(p => p.PAT_NUMBER === patNumber);
    if (patient) {
      setFormData({
        ...formData,
        patientNumber: patient.PAT_NUMBER,
        patientName: `${patient.PAT_FNAME} ${patient.PAT_LNAME}`,
        patientAddress: patient.PAT_ADR || '',
        patientAge: patient.PAT_AGE?.toString() || '',
        prescription: '',
      });
      setSelectedPrescription(null);
      fetchPrescriptions(patNumber);
    }
  };

  const handlePrescriptionChange = (presNumber: string) => {
    const prescription = prescriptions.find(p => p.PRES_NUMBER === presNumber);
    if (prescription) {
      setSelectedPrescription({
        PRES_MEDICATION: prescription.PRES_MEDICATION,
        PRES_DOSAGE: prescription.PRES_DOSAGE,
        PRES_FREQUENCY: prescription.PRES_FREQUENCY,
        PRES_DURATION: prescription.PRES_DURATION,
        PRES_NOTES: prescription.PRES_NOTES || '',
      });
      setFormData({
        ...formData,
        prescription: presNumber,
      });
    }
  };

  const handleDoctorChange = (docNumber: string) => {
    setFormData({
      ...formData,
      doctorNumber: docNumber,
    });
  };

  useEffect(() => {
    if (record) {
      setFormData({
        number: record.MDR_NUMBER || '',
        patientNumber: record.MDR_PAT_NUMBER || '',
        patientName: record.MDR_PAT_NAME || '',
        patientAddress: record.MDR_PAT_ADR || '',
        patientAge: record.MDR_PAT_AGE?.toString() || '',
        patientAilment: record.MDR_PAT_AILMENT || '',
        doctorNumber: record.MDR_DOC_NUMBER || '',
        prescription: record.MDR_PAT_PRESCR || '',
        diagnosis: record.MDR_DIAGNOSIS || '',
        treatmentPlan: record.MDR_TREATMENT_PLAN || '',
      });
      
      // Fetch prescriptions for the existing patient
      if (record.MDR_PAT_NUMBER) {
        fetchPrescriptions(record.MDR_PAT_NUMBER);
      }
    } else {
      setFormData({
        number: '',
        patientNumber: '',
        patientName: '',
        patientAddress: '',
        patientAge: '',
        patientAilment: '',
        doctorNumber: '',
        prescription: '',
        diagnosis: '',
        treatmentPlan: '',
      });
    }
  }, [record]);

  // Update selected prescription details when prescriptions are loaded
  useEffect(() => {
    if (formData.prescription && prescriptions.length > 0) {
      const prescription = prescriptions.find(p => p.PRES_NUMBER === formData.prescription);
      if (prescription) {
        setSelectedPrescription({
          PRES_MEDICATION: prescription.PRES_MEDICATION,
          PRES_DOSAGE: prescription.PRES_DOSAGE,
          PRES_FREQUENCY: prescription.PRES_FREQUENCY,
          PRES_DURATION: prescription.PRES_DURATION,
          PRES_NOTES: prescription.PRES_NOTES || '',
        });
      }
    }
  }, [prescriptions, formData.prescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = '/api/records';
      const method = record ? 'PUT' : 'POST';
      
      const body = record
        ? { id: record.MDR_ID, ...formData }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save record');

      toast.success(record ? 'Medical record updated successfully' : 'Medical record created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Failed to save medical record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key={record?.MDR_ID || 'new'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#131f36] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white/95 dark:bg-[#131f36]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/80 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-heading">
            {record ? 'Edit Medical Record' : 'Add Medical Record'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-hospital">
                Patient *
              </label>
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
                disabled={!!record}
              />
            </div>

            <div>
              <label className="label-hospital">
                Patient Number *
              </label>
              <input
                type="text"
                required
                value={formData.patientNumber}
                readOnly
                className="input-hospital bg-muted opacity-80 cursor-not-allowed"
                placeholder="Auto-filled"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-hospital">
                Patient Name *
              </label>
              <input
                type="text"
                required
                value={formData.patientName}
                readOnly
                className="input-hospital bg-muted opacity-80 cursor-not-allowed"
                placeholder="Auto-filled"
              />
            </div>

            <div>
              <label className="label-hospital">
                Patient Age
              </label>
              <input
                type="number"
                value={formData.patientAge}
                readOnly
                className="input-hospital bg-muted opacity-80 cursor-not-allowed"
                placeholder="Auto-filled"
              />
            </div>
          </div>

          <div>
            <label className="label-hospital">
              Patient Address
            </label>
            <input
              type="text"
              value={formData.patientAddress}
              readOnly
              className="input-hospital bg-muted opacity-80 cursor-not-allowed"
              placeholder="Auto-filled"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-hospital">
                Patient Ailment
              </label>
              <input
                type="text"
                value={formData.patientAilment}
                onChange={(e) => setFormData({ ...formData, patientAilment: e.target.value })}
                className="input-hospital"
                placeholder="Enter patient ailment"
              />
            </div>

            <div>
              <label className="label-hospital">
                Doctor
              </label>
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
          </div>

          <div>
            <label className="label-hospital">
              Diagnosis
            </label>
            <textarea
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              className="textarea-hospital"
              placeholder="Enter diagnosis details"
              rows={3}
            />
          </div>

          <div>
            <label className="label-hospital">
              Treatment Plan
            </label>
            <textarea
              value={formData.treatmentPlan}
              onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
              className="textarea-hospital"
              placeholder="Enter treatment plan details"
              rows={3}
            />
          </div>

          <div>
            <label className="label-hospital">
              Prescription
            </label>
            <Combobox
              options={prescriptions.map((pres) => ({
                value: pres.PRES_NUMBER,
                label: `${pres.PRES_NUMBER} - ${pres.PRES_MEDICATION}`
              }))}
              value={formData.prescription}
              onChange={handlePrescriptionChange}
              placeholder={formData.patientNumber ? "Select prescription" : "Select patient first"}
              searchPlaceholder="Search prescriptions..."
              emptyMessage={formData.patientNumber ? "No prescriptions found for this patient" : "Select a patient first"}
              disabled={!formData.patientNumber}
            />
          </div>

          {selectedPrescription && (
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl space-y-3 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
              <h4 className="font-bold text-heading text-sm">Prescription Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted block text-xs">Medication:</span>
                  <p className="text-heading font-semibold">{selectedPrescription.PRES_MEDICATION}</p>
                </div>
                <div>
                  <span className="text-muted block text-xs">Dosage:</span>
                  <p className="text-heading font-semibold">{selectedPrescription.PRES_DOSAGE}</p>
                </div>
                <div>
                  <span className="text-muted block text-xs">Frequency:</span>
                  <p className="text-heading font-semibold">{selectedPrescription.PRES_FREQUENCY}</p>
                </div>
                <div>
                  <span className="text-muted block text-xs">Duration:</span>
                  <p className="text-heading font-semibold">{selectedPrescription.PRES_DURATION}</p>
                </div>
                {selectedPrescription.PRES_NOTES && (
                  <div className="col-span-2">
                    <span className="text-muted block text-xs">Instructions:</span>
                    <p className="text-heading font-semibold">{selectedPrescription.PRES_NOTES}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700/80">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 shadow-lg"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {record ? 'Update' : 'Create'} Record
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
