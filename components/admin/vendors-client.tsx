'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Building2, Phone, Mail, MapPin, CheckCircle2, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import VendorsForm from './vendors-form';
import { toast } from 'sonner';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';

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

export default function VendorsClient() {
  const safeDelete = useSafeDelete();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async (skipCache = false) => {
    try {
      if (vendors.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/vendors');
      }
      const data = await fetchWithCache<Vendor[]>('/api/vendors');
      setVendors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      if (vendors.length === 0) {
        toast.error('Failed to load vendors');
        setVendors([]);
      }
    } finally {
      setLoading(false);
    }
  };

  function handleDelete(vendor: Vendor) {
    safeDelete.requestDelete({
      url: `/api/vendors?id=${vendor.V_ID}`,
      itemType: 'Vendor',
      itemTitle: vendor.V_NAME,
      successMessage: 'Vendor deleted successfully',
      onSuccess: () => fetchVendors(true),
    });
  }

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingVendor(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVendor(null);
  };

  const handleSuccess = () => {
    fetchVendors(true);
    handleCloseForm();
  };

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) =>
      `${vendor.V_NAME || ''} ${vendor.V_EMAIL || ''} ${vendor.V_PHONE || ''} ${vendor.V_MOBILE || ''} ${vendor.V_NUMBER || ''} ${vendor.V_ADR || ''} ${vendor.V_DESC || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [vendors, searchTerm]);

  // Dynamic KPI Stats
  const emailVerifiedCount = useMemo(() => {
    return vendors.filter((v) => v.V_EMAIL && v.V_EMAIL.includes('@')).length;
  }, [vendors]);

  const phoneContactCount = useMemo(() => {
    return vendors.filter((v) => v.V_PHONE || v.V_MOBILE).length;
  }, [vendors]);

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
                Vendor Management
              </h1>
              <span className="badge-counter">
                {vendors.length} Total
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Pharmaceutical suppliers, equipment manufacturers, and logistics partners
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
              <span>Add New Vendor</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Registered Vendors</p>
                <p className="text-2xl font-bold text-heading mt-1">{vendors.length}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-primary shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Active Logistics</p>
                <p className="text-2xl font-bold text-heading mt-1">{vendors.length}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-success shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Verified Email Channels</p>
                <p className="text-2xl font-bold text-heading mt-1">{emailVerifiedCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-info shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Direct Phone Lines</p>
                <p className="text-2xl font-bold text-heading mt-1">{phoneContactCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-warning shadow-sm">
                <Phone className="w-5 h-5" />
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
                placeholder="Search vendors by name, vendor number, email, phone, or address..."
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
                <p className="text-body font-medium">Loading hospital vendors...</p>
              </div>
            ) : filteredVendors.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-muted text-muted-foreground border border-border">
                  <Building2 className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No vendors found</p>
                <p className="text-muted text-sm">Try adjusting your search query or register a new vendor partner</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> Add Vendor
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-32">Vendor No.</th>
                      <th className="w-56">Vendor Name</th>
                      <th>Address</th>
                      <th className="w-48">Contact</th>
                      <th className="w-52">Email</th>
                      <th className="text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredVendors.map((vendor, index) => (
                        <motion.tr
                          key={vendor.V_ID}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <td className="table-id-link">
                            {vendor.V_NUMBER || `VND-${vendor.V_ID}`}
                          </td>
                          <td className="font-semibold text-heading">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-primary shrink-0" />
                              <span>{vendor.V_NAME}</span>
                            </div>
                          </td>
                          <td className="text-muted text-sm max-w-xs truncate">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-muted shrink-0" />
                              <span>{vendor.V_ADR || '—'}</span>
                            </div>
                          </td>
                          <td className="text-body text-sm font-medium">
                            <div className="space-y-0.5">
                              {vendor.V_PHONE && (
                                <div className="flex items-center gap-1.5 text-xs text-foreground">
                                  <Phone className="w-3 h-3 text-primary" />
                                  <span>{vendor.V_PHONE}</span>
                                </div>
                              )}
                              {vendor.V_MOBILE && (
                                <div className="flex items-center gap-1.5 text-xs text-muted">
                                  <Phone className="w-3 h-3 text-kpi-success" />
                                  <span>{vendor.V_MOBILE}</span>
                                </div>
                              )}
                              {!vendor.V_PHONE && !vendor.V_MOBILE && <span className="text-muted text-xs">—</span>}
                            </div>
                          </td>
                          <td className="text-body text-sm">
                            {vendor.V_EMAIL ? (
                              <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                                <Mail className="w-3 h-3 text-muted" />
                                <span>{vendor.V_EMAIL}</span>
                              </div>
                            ) : (
                              <span className="text-muted text-xs">—</span>
                            )}
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(vendor)}
                                className="table-action-edit hover-lift cursor-pointer"
                                title="Edit Vendor"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(vendor)}
                                disabled={safeDelete.isDeleting}
                                className="table-action-delete hover-lift cursor-pointer"
                                title="Delete Vendor"
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
          <VendorsForm
            vendor={editingVendor}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
