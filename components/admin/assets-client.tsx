'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Package, CheckCircle2, AlertTriangle, Archive, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AssetsForm from './assets-form';
import { toast } from 'sonner';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';

interface Asset {
  ASST_ID: number;
  ASST_NAME: string;
  ASST_DESC: string;
  ASST_VENDOR: string;
  ASST_STATUS: string;
  ASST_DEPT: string;
}

export default function AssetsClient() {
  const safeDelete = useSafeDelete();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async (skipCache = false) => {
    try {
      if (assets.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/assets');
      }
      const data = await fetchWithCache<Asset[]>('/api/assets');
      setAssets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching assets:', error);
      if (assets.length === 0) {
        toast.error('Failed to load assets');
        setAssets([]);
      }
    } finally {
      setLoading(false);
    }
  };

  function handleDelete(asset: Asset) {
    safeDelete.requestDelete({
      url: `/api/assets?id=${asset.ASST_ID}`,
      itemType: 'Asset',
      itemTitle: asset.ASST_NAME,
      successMessage: 'Asset deleted successfully',
      onSuccess: () => fetchAssets(true),
    });
  }

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingAsset(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAsset(null);
  };

  const handleSuccess = () => {
    fetchAssets(true);
    handleCloseForm();
  };

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) =>
      `${asset.ASST_NAME || ''} ${asset.ASST_DEPT || ''} ${asset.ASST_VENDOR || ''} ${asset.ASST_STATUS || ''} ${asset.ASST_DESC || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [assets, searchTerm]);

  // Dynamic KPI Stats
  const activeCount = useMemo(() => {
    return assets.filter((a) => {
      const s = a.ASST_STATUS?.toLowerCase() || '';
      return s.includes('active') || s.includes('functioning');
    }).length;
  }, [assets]);

  const maintenanceCount = useMemo(() => {
    return assets.filter((a) => a.ASST_STATUS?.toLowerCase().includes('maintenance')).length;
  }, [assets]);

  const retiredCount = useMemo(() => {
    return assets.filter((a) => {
      const s = a.ASST_STATUS?.toLowerCase() || '';
      return s.includes('retired') || s.includes('damaged');
    }).length;
  }, [assets]);

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('active') || s.includes('functioning')) return 'badge-success';
    if (s.includes('maintenance')) return 'badge-warning';
    if (s.includes('damaged')) return 'badge-danger';
    if (s.includes('retired')) return 'badge-purple';
    return 'badge-info';
  };

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
                Asset Management
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {assets.length} Total
              </span>
            </div>
            <p className="text-muted mt-1">
              Track and manage hospital capital infrastructure, assets, and departmental allocations
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
              <span>Add New Asset</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Assets</p>
                <p className="text-2xl font-bold text-heading mt-1">{assets.length}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
                <Package className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Operational & Active</p>
                <p className="text-2xl font-bold text-heading mt-1">{activeCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Under Maintenance</p>
                <p className="text-2xl font-bold text-heading mt-1">{maintenanceCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Retired / Damaged</p>
                <p className="text-2xl font-bold text-heading mt-1">{retiredCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400">
                <Archive className="w-5 h-5" />
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
                placeholder="Search assets by name, department, vendor, or status..."
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
                <p className="text-body font-medium">Loading hospital assets...</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-slate-800/80 text-muted border border-slate-700">
                  <Package className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No assets found</p>
                <p className="text-muted text-sm">Try adjusting your search query or add a new asset</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> Add Asset
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-24">ID</th>
                      <th className="w-56">Asset Name</th>
                      <th>Description</th>
                      <th className="w-44">Vendor</th>
                      <th className="w-40">Department</th>
                      <th className="w-36">Status</th>
                      <th className="text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredAssets.map((asset, index) => (
                        <motion.tr
                          key={asset.ASST_ID}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <td className="font-mono text-cyan-400 font-medium">
                            #{asset.ASST_ID}
                          </td>
                          <td className="font-semibold text-heading">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-cyan-400 shrink-0" />
                              {asset.ASST_NAME}
                            </div>
                          </td>
                          <td className="text-muted text-sm max-w-xs truncate">
                            {asset.ASST_DESC || '—'}
                          </td>
                          <td className="text-body text-sm font-medium">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-muted" />
                              {asset.ASST_VENDOR || '—'}
                            </div>
                          </td>
                          <td>
                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {asset.ASST_DEPT || 'General'}
                            </span>
                          </td>
                          <td>
                            <Badge className={`badge ${getStatusBadge(asset.ASST_STATUS)}`}>
                              {asset.ASST_STATUS}
                            </Badge>
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(asset)}
                                className="hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all hover-lift cursor-pointer"
                                title="Edit Asset"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(asset)}
                                disabled={safeDelete.isDeleting}
                                className="hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all hover-lift cursor-pointer"
                                title="Delete Asset"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && (
          <AssetsForm
            asset={editingAsset}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
