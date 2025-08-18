'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Patient {
  PAT_NUMBER: string;
  PAT_FNAME: string;
  PAT_LNAME: string;
}

interface PatientTransfer {
  PT_ID: number;
  PT_PAT_NUMBER: string;
  PT_PAT_NAME: string;
  PT_FROM_WARD: string;
  PT_TO_WARD: string;
  PT_REASON: string;
  PT_STATUS: string;
}

interface PatientTransferFormProps {
  transfer?: PatientTransfer;
  onClose: () => void;
  onSuccess: () => void;
  doctorName: string;
}

export function PatientTransferForm({ transfer, onClose, onSuccess, doctorName }: PatientTransferFormProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    patientNumber: transfer?.PT_PAT_NUMBER || '',
    patientName: transfer?.PT_PAT_NAME || '',
    from_ward: transfer?.PT_FROM_WARD || '',
    to_ward: transfer?.PT_TO_WARD || '',
    reason: transfer?.PT_REASON || '',
    status: transfer?.PT_STATUS || 'Pending',
    authorized_by: doctorName,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const doctorResponse = await fetch('/api/doctors/me');
      const doctor = await doctorResponse.json();
      
      const response = await fetch(`/api/doctors/${doctor.DOC_NUMBER}/patients`);
      const data = await response.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handlePatientChange = (patNumber: string) => {
    const patient = patients.find(p => p.PAT_NUMBER === patNumber);
    if (patient) {
      setFormData({
        ...formData,
        patientNumber: patNumber,
        patientName: `${patient.PAT_FNAME} ${patient.PAT_LNAME}`,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/patient-transfers';
      const method = transfer ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientNumber: formData.patientNumber,
          patientName: formData.patientName,
          from_ward: formData.from_ward,
          to_ward: formData.to_ward,
          reason: formData.reason,
          authorized_by: formData.authorized_by,
          status: formData.status,
          ...(transfer ? { id: transfer.PT_ID } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save transfer');
      }

      onSuccess();
      toast.success(transfer ? 'Transfer updated successfully' : 'Transfer created successfully');
      onClose();
    } catch (error) {
      console.error('Error saving transfer:', error);
      toast.error((error as Error).message || 'Failed to save patient transfer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 border-b border-emerald-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {transfer ? 'Edit Patient Transfer' : 'New Patient Transfer'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Patient
              </label>
              <select
                value={formData.patientNumber}
                onChange={(e) => handlePatientChange(e.target.value)}
                required
                disabled={!!transfer}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.PAT_NUMBER} value={patient.PAT_NUMBER}>
                    {patient.PAT_FNAME} {patient.PAT_LNAME} ({patient.PAT_NUMBER})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Ward/Department
              </label>
              <input
                type="text"
                value={formData.from_ward}
                onChange={(e) => setFormData({ ...formData, from_ward: e.target.value })}
                required
                placeholder="e.g., ICU, Emergency, Ward A"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Ward/Department
              </label>
              <input
                type="text"
                value={formData.to_ward}
                onChange={(e) => setFormData({ ...formData, to_ward: e.target.value })}
                required
                placeholder="e.g., General Ward, Cardiology, Another Hospital"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {transfer && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason for Transfer
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              rows={4}
              placeholder="Describe the reason for the transfer..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              {loading ? 'Saving...' : transfer ? 'Update Transfer' : 'Create Transfer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
