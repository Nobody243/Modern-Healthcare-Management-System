'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Pill, AlertTriangle, CheckCircle2, Package, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PharmaceuticalForm, Pharmaceutical } from './pharmaceutical-form';
import { toast } from 'sonner';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';

export default function PharmaceuticalsClient() {
  const [pharmaceuticals, setPharmaceuticals] = useState<Pharmaceutical[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPharmaceutical, setSelectedPharmaceutical] = useState<Pharmaceutical | undefined>();
  const safeDelete = useSafeDelete();

  useEffect(() => {
    fetchPharmaceuticals();
  }, []);

  async function fetchPharmaceuticals(skipCache = false) {
    try {
      if (pharmaceuticals.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/pharmaceuticals');
      }
      const data = await fetchWithCache<Pharmaceutical[]>('/api/pharmaceuticals');
      setPharmaceuticals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching pharmaceuticals:', error);
      if (pharmaceuticals.length === 0) {
        setPharmaceuticals([]);
        toast.error('Failed to load pharmaceuticals');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(item: Pharmaceutical) {
    safeDelete.requestDelete({
      url: `/api/pharmaceuticals?id=${item.PHAR_ID}`,
      itemType: 'Pharmaceutical',
      itemTitle: item.PHAR_NAME,
      successMessage: 'Pharmaceutical deleted successfully',
      onSuccess: () => fetchPharmaceuticals(true),
    });
  }

  function handleEdit(item: Pharmaceutical) {
    setSelectedPharmaceutical(item);
    setFormOpen(true);
  }

  function handleAddNew() {
    setSelectedPharmaceutical(undefined);
    setFormOpen(true);
  }

  function handleFormSuccess() {
    toast.success(`Pharmaceutical ${selectedPharmaceutical ? 'updated' : 'added'} successfully`);
    fetchPharmaceuticals(true);
  }

  const filteredPharmaceuticals = useMemo(() => {
    return pharmaceuticals.filter((item) =>
      `${item.PHAR_NAME || ''} ${item.PHAR_BCODE || ''} ${item.PHAR_CAT || ''} ${item.PHAR_VENDOR || ''} ${item.PHAR_DESC || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [pharmaceuticals, searchTerm]);

  // Dynamic KPI Stats
  const totalUnits = useMemo(() => {
    return pharmaceuticals.reduce((sum, p) => sum + (Number(p.PHAR_QTY) || 0), 0);
  }, [pharmaceuticals]);

  const lowStockItems = useMemo(() => {
    return pharmaceuticals.filter((p) => (Number(p.PHAR_QTY) || 0) < 50).length;
  }, [pharmaceuticals]);

  const healthyStockItems = useMemo(() => {
    return pharmaceuticals.filter((p) => (Number(p.PHAR_QTY) || 0) >= 50).length;
  }, [pharmaceuticals]);

  return (
    <>
      <div className="space-y-6">
        {/* Executive Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-heading">
                Pharmaceutical Inventory
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {pharmaceuticals.length} Drugs ({totalUnits.toLocaleString()} Units)
              </span>
            </div>
            <p className="text-muted mt-1">
              Manage medicine formulary stocks, barcode lot numbers, and dispensing inventory
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={handleAddNew}
              className="btn-primary flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Pharmaceutical</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Formulary Drugs</p>
                <p className="text-2xl font-bold text-heading mt-1">{pharmaceuticals.length}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
                <Pill className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Adequate Stock</p>
                <p className="text-2xl font-bold text-heading mt-1">{healthyStockItems}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Low Stock Warning (&lt;50)</p>
                <p className="text-2xl font-bold text-heading mt-1">{lowStockItems}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Inventory Units</p>
                <p className="text-2xl font-bold text-heading mt-1">{totalUnits.toLocaleString()}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400">
                <Package className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>

        {/* Frosted Filter & Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-glass p-4 border border-slate-700/50 shadow-md backdrop-blur-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                placeholder="Search by drug name, barcode, category, vendor, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-hospital pl-10 h-11"
              />
            </div>
          </Card>
        </motion.div>

        {/* Table View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card overflow-hidden border border-slate-700/50 shadow-xl bg-slate-900/60 backdrop-blur-xl">
            <div className="h-1 bg-gradient-to-r from-sky-500 via-teal-500 to-cyan-500" />
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-cyan-400" />
                <p className="text-body font-medium">Loading pharmaceuticals inventory...</p>
              </div>
            ) : filteredPharmaceuticals.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-slate-800/80 text-muted border border-slate-700">
                  <Pill className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No pharmaceuticals found</p>
                <p className="text-muted text-sm">Try adjusting your search query or add a new drug</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> Add Pharmaceutical
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-32">Barcode</th>
                      <th className="w-56">Medicine Name</th>
                      <th className="w-44">Category</th>
                      <th className="w-48">Vendor</th>
                      <th className="w-28 text-center">Stock</th>
                      <th>Description</th>
                      <th className="text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredPharmaceuticals.map((item, index) => {
                        const qty = Number(item.PHAR_QTY) || 0;
                        const isLowStock = qty < 50;
                        return (
                          <motion.tr
                            key={item.PHAR_ID}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            <td className="font-mono text-cyan-400 font-medium">
                              {item.PHAR_BCODE}
                            </td>
                            <td className="font-semibold text-heading">
                              <div className="flex items-center gap-2">
                                <Pill className="w-4 h-4 text-cyan-400 shrink-0" />
                                <span>{item.PHAR_NAME}</span>
                              </div>
                            </td>
                            <td>
                              <Badge className="badge badge-info">
                                {item.PHAR_CAT}
                              </Badge>
                            </td>
                            <td className="text-body text-sm font-medium">
                              {item.PHAR_VENDOR}
                            </td>
                            <td className="text-center">
                              <span
                                className={`inline-flex items-center gap-1 font-mono font-bold px-2.5 py-0.5 rounded-full text-xs ${
                                  isLowStock
                                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse'
                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                {qty}
                              </span>
                            </td>
                            <td className="text-muted text-sm max-w-xs truncate">
                              {item.PHAR_DESC || '—'}
                            </td>
                            <td className="text-right">
                              <div className="flex gap-1.5 justify-end">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleEdit(item)}
                                  className="hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all hover-lift cursor-pointer"
                                  title="Edit Medication"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDelete(item)}
                                  disabled={safeDelete.isDeleting}
                                  className="hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all hover-lift cursor-pointer"
                                  title="Delete Medication"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <PharmaceuticalForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        pharmaceutical={selectedPharmaceutical}
        onSuccess={handleFormSuccess}
      />

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
