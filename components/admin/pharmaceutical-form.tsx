'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Pill, Barcode, Package, DollarSign, Calendar, FileText, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface Pharmaceutical {
  PHAR_ID: number;
  PHAR_NAME: string;
  PHAR_BCODE: string;
  PHAR_DESC?: string;
  PHAR_QTY: number;
  PHAR_UNIT_PRICE?: number;
  PHAR_CAT?: string;
  PHAR_VENDOR?: string;
  PHAR_EXPIRY_DATE?: string;
  PHAR_MANUFACTURING_DATE?: string;
}

interface PharmaceuticalFormProps {
  open: boolean;
  onClose: () => void;
  pharmaceutical?: Pharmaceutical;
  onSuccess: () => void;
}

export function PharmaceuticalForm({ open, onClose, pharmaceutical, onSuccess }: PharmaceuticalFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Array<{ PHARM_CAT_NAME: string }>>([]);
  const [vendors, setVendors] = useState<Array<{ V_NAME: string }>>([]);

  const isEdit = !!pharmaceutical;

  useEffect(() => {
    fetchCategories();
    fetchVendors();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/pharmaceutical-categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      id: pharmaceutical?.PHAR_ID,
      name: formData.get('name'),
      bcode: formData.get('bcode'),
      desc: formData.get('desc'),
      qty: formData.get('qty'),
      unit_price: formData.get('unit_price'),
      cat: formData.get('cat'),
      vendor: formData.get('vendor'),
      expiry_date: formData.get('expiry_date') || null,
      manufacturing_date: formData.get('manufacturing_date') || null,
    };

    try {
      const url = '/api/pharmaceuticals';
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to save pharmaceutical');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent key={pharmaceutical?.PHAR_ID || 'new'} className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-heading flex items-center gap-2">
            <Pill className="w-6 h-6 text-primary" />
            {isEdit ? 'Edit Pharmaceutical' : 'Add New Pharmaceutical'}
          </DialogTitle>
          <DialogDescription className="text-muted">
            {isEdit ? 'Update pharmaceutical information' : 'Fill in the product details below'}
          </DialogDescription>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-6 mt-4"
        >
          {/* Product Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-heading flex items-center gap-2 border-b border-border pb-2">
              <Package className="w-4 h-4 text-primary" />
              Product Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-muted" />
                  Product Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={pharmaceutical?.PHAR_NAME}
                  required
                  placeholder="Paracetamol 500mg"
                  className="input-hospital"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bcode" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Barcode className="w-3.5 h-3.5 text-muted" />
                  Barcode *
                </Label>
                <Input
                  id="bcode"
                  name="bcode"
                  defaultValue={pharmaceutical?.PHAR_BCODE}
                  required
                  placeholder="123456789"
                  className="input-hospital"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Category & Vendor */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-heading flex items-center gap-2 border-b border-border pb-2">
              <Building2 className="w-4 h-4 text-primary" />
              Category and Vendor
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-muted" />
                  Category *
                </Label>
                <Combobox
                  options={categories.map((cat) => ({
                    value: cat.PHARM_CAT_NAME,
                    label: cat.PHARM_CAT_NAME
                  }))}
                  value={pharmaceutical?.PHAR_CAT || ''}
                  onChange={(value) => {
                    const input = document.getElementById('cat') as HTMLInputElement;
                    if (input) input.value = value;
                  }}
                  placeholder="Select category"
                  searchPlaceholder="Search categories..."
                  emptyMessage="No category found."
                  disabled={loading}
                />
                <input type="hidden" id="cat" name="cat" defaultValue={pharmaceutical?.PHAR_CAT} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-muted" />
                  Vendor *
                </Label>
                <Combobox
                  options={vendors.map((vendor) => ({
                    value: vendor.V_NAME,
                    label: vendor.V_NAME
                  }))}
                  value={pharmaceutical?.PHAR_VENDOR || ''}
                  onChange={(value) => {
                    const input = document.getElementById('vendor') as HTMLInputElement;
                    if (input) input.value = value;
                  }}
                  placeholder="Select vendor"
                  searchPlaceholder="Search vendors..."
                  emptyMessage="No vendor found."
                  disabled={loading}
                />
                <input type="hidden" id="vendor" name="vendor" defaultValue={pharmaceutical?.PHAR_VENDOR} required />
              </div>
            </div>
          </div>

          {/* Inventory & Pricing */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-heading flex items-center gap-2 border-b border-border pb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Inventory & Pricing
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qty" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-muted" />
                  Quantity *
                </Label>
                <Input
                  id="qty"
                  name="qty"
                  type="number"
                  defaultValue={pharmaceutical?.PHAR_QTY}
                  required
                  placeholder="100"
                  className="input-hospital"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit_price" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-muted" />
                  Unit Price
                </Label>
                <Input
                  id="unit_price"
                  name="unit_price"
                  type="number"
                  step="0.01"
                  defaultValue={pharmaceutical?.PHAR_UNIT_PRICE}
                  placeholder="0.00"
                  className="input-hospital"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturing_date" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted" />
                  Mfg. Date
                </Label>
                <Input
                  id="manufacturing_date"
                  name="manufacturing_date"
                  type="date"
                  defaultValue={pharmaceutical?.PHAR_MANUFACTURING_DATE ? new Date(pharmaceutical.PHAR_MANUFACTURING_DATE).toISOString().split('T')[0] : ''}
                  className="input-hospital"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry_date" className="text-sm font-medium text-muted flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted" />
                  Expiry Date
                </Label>
                <Input
                  id="expiry_date"
                  name="expiry_date"
                  type="date"
                  defaultValue={pharmaceutical?.PHAR_EXPIRY_DATE ? new Date(pharmaceutical.PHAR_EXPIRY_DATE).toISOString().split('T')[0] : ''}
                  className="input-hospital"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-heading flex items-center gap-2 border-b border-border pb-2">
              <FileText className="w-4 h-4 text-primary" />
              Description
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="desc" className="text-sm font-medium text-muted flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-muted" />
                Product Description
              </Label>
              <Input
                id="desc"
                name="desc"
                defaultValue={pharmaceutical?.PHAR_DESC}
                placeholder="Product description (optional)"
                className="input-hospital"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 btn-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                'Update Product'
              ) : (
                'Add Product'
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
