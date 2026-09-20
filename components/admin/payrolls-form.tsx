'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Combobox } from '@/components/ui/combobox';

interface Payroll {
  PAY_ID: number;
  PAY_NUMBER: string;
  PAY_DOC_NUMBER: string;
  PAY_DOC_NAME: string;
  PAY_DOC_EMAIL: string;
  PAY_AMOUNT: number;
  PAY_PERIOD: string;
  PAY_STATUS: string;
  PAY_DATE: string;
  PAY_METHOD: string;
}

interface Props {
  payroll: Payroll | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PayrollsForm({ payroll, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Array<{ DOC_NUMBER: string; DOC_FNAME: string; DOC_LNAME: string; DOC_EMAIL: string }>>([]);
  const [formData, setFormData] = useState({
    number: payroll?.PAY_NUMBER || '',
    doc_number: payroll?.PAY_DOC_NUMBER || '',
    doc_name: payroll?.PAY_DOC_NAME || '',
    doc_email: payroll?.PAY_DOC_EMAIL || '',
    amount: payroll?.PAY_AMOUNT?.toString() || '',
    period: payroll?.PAY_PERIOD || '',
    status: payroll?.PAY_STATUS || 'Pending',
    date: payroll?.PAY_DATE || new Date().toISOString().split('T')[0],
    method: payroll?.PAY_METHOD || 'Bank Transfer',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (payroll) {
      setFormData({
        number: payroll.PAY_NUMBER || '',
        doc_number: payroll.PAY_DOC_NUMBER || '',
        doc_name: payroll.PAY_DOC_NAME || '',
        doc_email: payroll.PAY_DOC_EMAIL || '',
        amount: payroll.PAY_AMOUNT?.toString() || '',
        period: payroll.PAY_PERIOD || '',
        status: payroll.PAY_STATUS || 'Pending',
        date: payroll.PAY_DATE ? new Date(payroll.PAY_DATE).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        method: payroll.PAY_METHOD || 'Bank Transfer',
      });
    }
  }, [payroll]);

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

  const handleDoctorChange = (docNumber: string) => {
    const doctor = doctors.find(d => d.DOC_NUMBER === docNumber);
    if (doctor) {
      setFormData({
        ...formData,
        doc_number: doctor.DOC_NUMBER,
        doc_name: `${doctor.DOC_FNAME} ${doctor.DOC_LNAME}`,
        doc_email: doctor.DOC_EMAIL || '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = '/api/payrolls';
      const method = payroll ? 'PUT' : 'POST';
      
      const body = payroll
        ? { id: payroll.PAY_ID, ...formData }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save payroll');

      toast.success(payroll ? 'Payroll updated successfully' : 'Payroll created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error saving payroll:', error);
      toast.error('Failed to save payroll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key={payroll?.PAY_ID || 'new'}
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
            {payroll ? 'Edit Payroll Record' : 'Add Payroll Record'}
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
              Doctor *
            </label>
            <Combobox
              options={doctors.map((doctor) => ({
                value: doctor.DOC_NUMBER,
                label: `${doctor.DOC_FNAME} ${doctor.DOC_LNAME} (${doctor.DOC_NUMBER})`
              }))}
              value={formData.doc_number}
              onChange={handleDoctorChange}
              placeholder="Select doctor"
              searchPlaceholder="Search doctors..."
              emptyMessage="No doctor found."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-heading mb-1.5">
                Amount *
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input-hospital"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-heading mb-1.5">
                Period
              </label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="input-hospital"
                placeholder="e.g., December 2025, Q4 2025"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="Paid">Paid</option>
                <option value="Cancelled">Cancelled</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-heading mb-1.5">
                Payment Method *
              </label>
              <select
                required
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="select-hospital"
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Check">Check</option>
                <option value="Cash">Cash</option>
                <option value="Direct Deposit">Direct Deposit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-heading mb-1.5">
              Date *
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-hospital"
            />
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
              {payroll ? 'Update' : 'Create'} Record
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
