'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Combobox } from '@/components/ui/combobox';

interface PharmaceuticalCategory {
  PHARM_CAT_ID: number;
  PHARM_CAT_NAME: string;
  PHARM_CAT_VENDOR: string;
  PHARM_CAT_DESC: string;
}

interface Props {
  category: PharmaceuticalCategory | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PharmaceuticalCategoriesForm({ category, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<Array<{ V_NAME: string }>>([]);
  const [formData, setFormData] = useState({
    name: category?.PHARM_CAT_NAME || '',
    vendor: category?.PHARM_CAT_VENDOR || '',
    description: category?.PHARM_CAT_DESC || '',
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.PHARM_CAT_NAME || '',
        vendor: category.PHARM_CAT_VENDOR || '',
        description: category.PHARM_CAT_DESC || '',
      });
    } else {
      setFormData({
        name: '',
        vendor: '',
        description: '',
      });
    }
  }, [category]);

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/vendors');
      if (response.ok) {
        const data = await response.json();
        setVendors(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = '/api/pharmaceutical-categories';
      const method = category ? 'PUT' : 'POST';
      
      const body = category
        ? { id: category.PHARM_CAT_ID, ...formData }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save category');

      toast.success(category ? 'Category updated successfully' : 'Category created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key={category?.PHARM_CAT_ID || 'new'}
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
            {category ? 'Edit Category' : 'Add Category'}
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
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-hospital"
              placeholder="e.g., Antibiotics, Analgesics"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-heading mb-1.5">
              Vendor
            </label>
            <Combobox
              options={vendors.map((vendor) => ({
                value: vendor.V_NAME,
                label: vendor.V_NAME
              }))}
              value={formData.vendor}
              onChange={(value) => setFormData({ ...formData, vendor: value })}
              placeholder="Select vendor (optional)"
              searchPlaceholder="Search vendors..."
              emptyMessage="No vendor found."
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
              placeholder="Enter category description"
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
              {category ? 'Update' : 'Create'} Category
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
