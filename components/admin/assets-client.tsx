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
import { DepartmentBadge } from '@/components/ui/department-badge';
import { StatusBadge } from '@/components/ui/status-badge';

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1"
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-heading tracking-tight">
                Asset Management
              </h1>
              <span className="badge-counter">
                {assets.length} Total
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Hospital capital infrastructure, facility assets, and departmental allocations
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={handleAddNew}
              className="btn-primary flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Asset</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Assets</p>
                <p className="text-2xl font-bold text-heading mt-1">{assets.length}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-primary shadow-sm">
                <Package className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Operational & Active</p>
                <p className="text-2xl font-bold text-heading mt-1">{activeCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-success shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Under Maintenance</p>
                <p className="text-2xl font-bold text-heading mt-1">{maintenanceCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-warning shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Retired / Damaged</p>
                <p className="text-2xl font-bold text-heading mt-1">{retiredCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-info shadow-sm">
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
          <Card className="card-glass p-4 border border-border/70 shadow-md backdrop-blur-md">
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
          <Card className="card overflow-hidden border border-border/70 shadow-xl bg-card/60 backdrop-blur-xl relative">
            <div className="card-accent-bar" />
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-body font-medium">Loading hospital assets...</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-muted text-muted-foreground border border-border">
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
                          <td className="table-id-link">
                            #{asset.ASST_ID}
                          </td>
                          <td className="font-semibold text-heading">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-primary shrink-0" />
                              {asset.ASST_NAME}
                            </div>
                          </td>
                          <td className="text-muted text-sm max-w-xs truncate">
                            {asset.ASST_DESC || '—'}
                          </td>
                          <td>
                            <span className="badge-tag-company">
                              <Building2 className="w-3 h-3 opacity-75" />
                              {asset.ASST_VENDOR || 'General Supply'}
                            </span>
                          </td>
                          <td>
                            <DepartmentBadge department={asset.ASST_DEPT} />
                          </td>
                          <td>
                            <StatusBadge status={asset.ASST_STATUS} showIcon />
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(asset)}
                                className="table-action-edit hover-lift cursor-pointer"
                                title="Edit Asset"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(asset)}
                                disabled={safeDelete.isDeleting}
                                className="table-action-delete hover-lift cursor-pointer"
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
