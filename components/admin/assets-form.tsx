'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Asset {
  ASST_ID: number;
  ASST_NAME: string;
  ASST_DESC: string;
  ASST_VENDOR: string;
  ASST_STATUS: string;
  ASST_DEPT: string;
}

interface Props {
  asset: Asset | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssetsForm({ asset, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: asset?.ASST_NAME || '',
    desc: asset?.ASST_DESC || '',
    vendor: asset?.ASST_VENDOR || '',
    status: asset?.ASST_STATUS || 'Active',
    dept: asset?.ASST_DEPT || '',
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.ASST_NAME || '',
        desc: asset.ASST_DESC || '',
        vendor: asset.ASST_VENDOR || '',
        status: asset.ASST_STATUS || 'Active',
        dept: asset.ASST_DEPT || '',
      });
    } else {
      setFormData({
        name: '',
        desc: '',
        vendor: '',
        status: 'Active',
        dept: '',
      });
    }
  }, [asset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = '/api/assets';
      const method = asset ? 'PUT' : 'POST';
      
      const body = asset
        ? { id: asset.ASST_ID, ...formData }
        : formData;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save asset');

      toast.success(asset ? 'Asset updated successfully' : 'Asset created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error saving asset:', error);
      toast.error('Failed to save asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!asset || asset === null} onOpenChange={() => onClose()}>
      <DialogContent key={asset?.ASST_ID || 'new'} className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            {asset ? 'Edit Asset' : 'Add New Asset'}
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            {asset ? 'Update asset information' : 'Fill in the asset details below'}
          </DialogDescription>
        </DialogHeader>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="space-y-5 mt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Asset Name *
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
              placeholder="Enter asset name"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Description *
            </Label>
            <Textarea
              id="desc"
              required
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400 min-h-20"
              placeholder="Enter asset description"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Vendor *
              </Label>
              <Input
                id="vendor"
                type="text"
                required
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                placeholder="Enter vendor name"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dept" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Department *
              </Label>
              <Input
                id="dept"
                type="text"
                required
                value={formData.dept}
                onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                className="h-11 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-sky-500 dark:focus:ring-sky-400"
                placeholder="Enter department"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Status *
            </Label>
            <select
              id="status"
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full h-11 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-transparent"
              disabled={loading}
            >
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Retired">Retired</option>
              <option value="Damaged">Damaged</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={loading}
              className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {asset ? 'Update' : 'Create'} Asset
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
