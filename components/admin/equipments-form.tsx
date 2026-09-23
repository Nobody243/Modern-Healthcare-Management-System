'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Equipment {
  EQP_ID: number;
  EQP_CODE: string;
  EQP_NAME: string;
  EQP_VENDOR: string;
  EQP_DESC: string;
  EQP_DEPT: string;
  EQP_STATUS: string;
  EQP_QTY: string;
}

interface Props {
  equipment: Equipment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EquipmentsForm({ equipment, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: equipment?.EQP_CODE || '',
    name: equipment?.EQP_NAME || '',
    vendor: equipment?.EQP_VENDOR || '',
    desc: equipment?.EQP_DESC || '',
    dept: equipment?.EQP_DEPT || '',
    status: equipment?.EQP_STATUS || 'Functioning',
    qty: equipment?.EQP_QTY || '',
  });

  useEffect(() => {
    if (equipment) {
      setFormData({
        code: equipment.EQP_CODE || '',
        name: equipment.EQP_NAME || '',
        vendor: equipment.EQP_VENDOR || '',
        desc: equipment.EQP_DESC || '',
        dept: equipment.EQP_DEPT || '',
        status: equipment.EQP_STATUS || 'Functioning',
        qty: equipment.EQP_QTY || '',
      });
    } else {
      setFormData({
        code: '',
        name: '',
        vendor: '',
        desc: '',
        dept: '',
        status: 'Functioning',
        qty: '',
      });
    }
  }, [equipment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = '/api/equipments';
      const method = equipment ? 'PUT' : 'POST';
      
      const body = equipment
        ? { id: equipment.EQP_ID, ...formData }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save equipment');

      toast.success(equipment ? 'Equipment updated successfully' : 'Equipment created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error saving equipment:', error);
      toast.error('Failed to save equipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key={equipment?.EQP_ID || 'new'}
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {equipment ? 'Edit Equipment' : 'Add Equipment'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-hospital">
                Equipment Code *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="input-hospital"
                placeholder="e.g., EQ001"
              />
            </div>

            <div>
              <label className="label-hospital">
                Equipment Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-hospital"
                placeholder="Enter equipment name"
              />
            </div>
          </div>

          <div>
            <label className="label-hospital">
              Description *
            </label>
            <textarea
              required
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className="textarea-hospital min-h-20"
              placeholder="Enter equipment description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-hospital">
                Vendor *
              </label>
              <input
                type="text"
                required
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="input-hospital"
                placeholder="Vendor name"
              />
            </div>

            <div>
              <label className="label-hospital">
                Department *
              </label>
              <select
                required
                value={formData.dept}
                onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                className="select-hospital"
              >
                <option value="">Select department</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Radiology">Radiology</option>
                <option value="Surgery">Surgery</option>
                <option value="Emergency">Emergency</option>
                <option value="ICU">ICU</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Nursing">Nursing</option>
                <option value="Pharmacy">Pharmacy</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-hospital">
                Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.qty}
                onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                className="input-hospital"
                placeholder="Enter quantity"
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
                <option value="Functioning">Functioning</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Broken">Broken</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
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
              className="btn-primary flex items-center gap-2 cursor-pointer"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {equipment ? 'Update' : 'Create'} Equipment
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
