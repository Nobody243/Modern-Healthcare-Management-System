'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Vendor {
  V_ID: number;
  V_NUMBER: string;
  V_NAME: string;
  V_ADR: string;
  V_MOBILE: string;
  V_EMAIL: string;
  V_PHONE: string;
  V_DESC: string;
}

interface Props {
  vendor: Vendor | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VendorsForm({ vendor, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    number: vendor?.V_NUMBER || '',
    name: vendor?.V_NAME || '',
    address: vendor?.V_ADR || '',
    mobile: vendor?.V_MOBILE || '',
    email: vendor?.V_EMAIL || '',
    phone: vendor?.V_PHONE || '',
    description: vendor?.V_DESC || '',
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        number: vendor.V_NUMBER || '',
        name: vendor.V_NAME || '',
        address: vendor.V_ADR || '',
        mobile: vendor.V_MOBILE || '',
        email: vendor.V_EMAIL || '',
        phone: vendor.V_PHONE || '',
        description: vendor.V_DESC || '',
      });
    } else {
      setFormData({
        number: '',
        name: '',
        address: '',
        mobile: '',
        email: '',
        phone: '',
        description: '',
      });
    }
  }, [vendor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = '/api/vendors';
      const method = vendor ? 'PUT' : 'POST';
      
      const body = vendor
        ? { id: vendor.V_ID, ...formData }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save vendor');

      toast.success(vendor ? 'Vendor updated successfully' : 'Vendor created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error saving vendor:', error);
      toast.error('Failed to save vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key={vendor?.V_ID || 'new'}
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
            {vendor ? 'Edit Vendor' : 'Add Vendor'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-heading mb-1.5">
                Vendor Number *
              </label>
              <input
                type="text"
                required
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="input-hospital"
                placeholder="e.g., V001"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-heading mb-1.5">
                Vendor Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-hospital"
                placeholder="Enter vendor name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-heading mb-1.5">
              Address *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input-hospital"
              placeholder="Enter vendor address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-heading mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-hospital"
                placeholder="Office phone"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-heading mb-1.5">
                Mobile
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="input-hospital"
                placeholder="Mobile phone"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-heading mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-hospital"
              placeholder="vendor@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-heading mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="textarea-hospital"
              placeholder="Enter vendor description"
              rows={4}
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
              {vendor ? 'Update' : 'Create'} Vendor
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
