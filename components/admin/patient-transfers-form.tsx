'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Combobox } from '@/components/ui/combobox';

interface PatientTransfer {
  PT_ID: number;
  PT_PAT_NUMBER: string;
  PT_PAT_NAME: string;
  PT_FROM_WARD: string;
  PT_TO_WARD: string;
  PT_REASON: string;
  PT_TRANSFER_DATE: string;
  PT_AUTHORIZED_BY: string;
  PT_STATUS: string;
}

interface Props {
  transfer: PatientTransfer | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PatientTransfersForm({ transfer, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Array<{ PAT_NUMBER: string; PAT_FNAME: string; PAT_LNAME: string }>>([]);
  const [formData, setFormData] = useState({
    from_ward: transfer?.PT_FROM_WARD || '',
    to_ward: transfer?.PT_TO_WARD || '',
    reason: transfer?.PT_REASON || '',
    patientName: transfer?.PT_PAT_NAME || '',
    patientNumber: transfer?.PT_PAT_NUMBER || '',
    authorized_by: transfer?.PT_AUTHORIZED_BY || '',
    status: transfer?.PT_STATUS || 'Pending',
  });

  useEffect(() => {
    fetchPatients();
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
      const endpoint = '/api/patient-transfers';
      const method = transfer ? 'PUT' : 'POST';
      
      const body = transfer
        ? { id: transfer.PT_ID, ...formData }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save transfer');

      toast.success(transfer ? 'Transfer updated successfully' : 'Transfer created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error saving transfer:', error);
      toast.error('Failed to save transfer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key={transfer?.PT_ID || 'new'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card text-card-foreground border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-heading">
            {transfer ? 'Edit Transfer' : 'Add Transfer'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-heading mb-1.5">
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
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-heading mb-1.5">
              From Ward *
            </label>
            <input
              type="text"
              required
              value={formData.from_ward}
              onChange={(e) => setFormData({ ...formData, from_ward: e.target.value })}
              className="input-hospital"
              placeholder="Enter current ward"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-heading mb-1.5">
              To Ward *
            </label>
            <input
              type="text"
              required
              value={formData.to_ward}
              onChange={(e) => setFormData({ ...formData, to_ward: e.target.value })}
              className="input-hospital"
              placeholder="Enter destination ward"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-heading mb-1.5">
              Reason
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="textarea-hospital"
              rows={3}
              placeholder="Enter reason for transfer"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-heading mb-1.5">
              Authorized By
            </label>
            <input
              type="text"
              value={formData.authorized_by}
              onChange={(e) => setFormData({ ...formData, authorized_by: e.target.value })}
              className="input-hospital"
              placeholder="Enter authorizing person's name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-heading mb-1.5">
              Status *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="select-hospital"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
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
              {transfer ? 'Update' : 'Create'} Transfer
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
