'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Combobox } from '@/components/ui/combobox';

export interface Surgery {
  SURG_ID: number;
  SURG_NUMBER: string;
  SURG_PAT_NAME?: string;
  SURG_PAT_NUMBER: string;
  SURG_DOC_NUMBER?: string;
  SURG_DOC_NAME?: string;
  SURG_TYPE: string;
  SURG_DATE: string;
  SURG_DURATION?: string;
  SURG_STATUS: string;
  SURG_NOTES?: string;
}

interface Props {
  surgery: Surgery | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SurgeryForm({ surgery, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Array<{ PAT_NUMBER: string; PAT_FNAME: string; PAT_LNAME: string }>>([]);
  const [doctors, setDoctors] = useState<Array<{ DOC_NUMBER: string; DOC_FNAME: string; DOC_LNAME: string }>>([]);
  const [formData, setFormData] = useState({
    number: surgery?.SURG_NUMBER || '',
    patientName: surgery?.SURG_PAT_NAME || '',
    patientNumber: surgery?.SURG_PAT_NUMBER || '',
    doctorNumber: surgery?.SURG_DOC_NUMBER || '',
    doctorName: surgery?.SURG_DOC_NAME || '',
    type: surgery?.SURG_TYPE || '',
    date: surgery?.SURG_DATE ? new Date(surgery.SURG_DATE).toISOString().split('T')[0] : '',
    duration: surgery?.SURG_DURATION || '',
    status: surgery?.SURG_STATUS || 'Scheduled',
    notes: surgery?.SURG_NOTES || '',
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

  useEffect(() => {
    if (surgery) {
      setFormData({
        number: surgery.SURG_NUMBER || '',
        patientName: surgery.SURG_PAT_NAME || '',
        patientNumber: surgery.SURG_PAT_NUMBER || '',
        doctorNumber: surgery.SURG_DOC_NUMBER || '',
        doctorName: surgery.SURG_DOC_NAME || '',
        type: surgery.SURG_TYPE || '',
        date: surgery.SURG_DATE ? new Date(surgery.SURG_DATE).toISOString().split('T')[0] : '',
        duration: surgery.SURG_DURATION || '',
        status: surgery.SURG_STATUS || 'Scheduled',
        notes: surgery.SURG_NOTES || '',
      });
    } else {
      setFormData({
        number: '',
        patientName: '',
        patientNumber: '',
        doctorNumber: '',
        doctorName: '',
        type: '',
        date: '',
        duration: '',
        status: 'Scheduled',
        notes: '',
      });
    }
  }, [surgery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = '/api/surgery';
      const method = surgery ? 'PUT' : 'POST';
      
      const body = surgery
        ? { id: surgery.SURG_ID, ...formData }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save surgery');
      }

      toast.success(surgery ? 'Surgery updated successfully' : 'Surgery created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error saving surgery:', error);
      toast.error('Failed to save surgery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key={surgery?.SURG_ID || 'new'}
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
            {surgery ? 'Edit Surgery Record' : 'Add Surgery Record'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {surgery && (
            <div>
              <label className="label-hospital">
                Surgery Number
              </label>
              <input
                type="text"
                value={formData.number}
                className="input-hospital bg-muted cursor-not-allowed opacity-80"
                disabled
              />
            </div>
          )}

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
                placeholder="Select a patient"
                searchPlaceholder="Search patients..."
                emptyMessage="No patient found."
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
                placeholder="Select a doctor"
                searchPlaceholder="Search doctors..."
                emptyMessage="No doctor found."
              />
            </div>
          </div>

          <div>
            <label className="label-hospital">
              Surgery Type *
            </label>
            <input
              type="text"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input-hospital"
              placeholder="Enter surgery type (e.g., Appendectomy, Cardiac)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-hospital">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="input-hospital"
                placeholder="e.g., 2 hours"
              />
            </div>

            <div>
              <label className="label-hospital">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="select-hospital"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label-hospital">
              Surgery Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-hospital"
            />
          </div>

          <div>
            <label className="label-hospital">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="textarea-hospital"
              rows={3}
              placeholder="Additional notes about the surgery"
            />
          </div>

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
              {surgery ? 'Update' : 'Create'} Surgery
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
