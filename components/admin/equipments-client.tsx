'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Wrench, CheckCircle2, AlertTriangle, XCircle, Building2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import EquipmentsForm from './equipments-form';
import { toast } from 'sonner';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';
import { DepartmentBadge } from '@/components/ui/department-badge';
import { StatusBadge } from '@/components/ui/status-badge';

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

export default function EquipmentsClient() {
  const safeDelete = useSafeDelete();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async (skipCache = false) => {
    try {
      if (equipments.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/equipments');
      }
      const data = await fetchWithCache<Equipment[]>('/api/equipments');
      setEquipments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching equipments:', error);
      if (equipments.length === 0) {
        toast.error('Failed to load equipments');
        setEquipments([]);
      }
    } finally {
      setLoading(false);
    }
  };

  function handleDelete(equipment: Equipment) {
    safeDelete.requestDelete({
      url: `/api/equipments?id=${equipment.EQP_ID}`,
      itemType: 'Equipment',
      itemTitle: equipment.EQP_NAME,
      successMessage: 'Equipment deleted successfully',
      onSuccess: () => fetchEquipments(true),
    });
  }

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingEquipment(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEquipment(null);
  };

  const handleSuccess = () => {
    fetchEquipments(true);
    handleCloseForm();
  };

  const filteredEquipments = useMemo(() => {
    return equipments.filter((equipment) =>
      `${equipment.EQP_NAME || ''} ${equipment.EQP_CODE || ''} ${equipment.EQP_VENDOR || ''} ${equipment.EQP_DEPT || ''} ${equipment.EQP_STATUS || ''} ${equipment.EQP_DESC || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [equipments, searchTerm]);

  // Dynamic KPI Stats
  const totalUnits = useMemo(() => {
    return equipments.reduce((sum, item) => sum + (parseInt(item.EQP_QTY || '1', 10) || 1), 0);
  }, [equipments]);

  const functioningCount = useMemo(() => {
    return equipments.filter((e) => {
      const s = e.EQP_STATUS?.toLowerCase() || '';
      return s.includes('functioning') || s.includes('active') || s.includes('operational');
    }).length;
  }, [equipments]);

  const maintenanceCount = useMemo(() => {
    return equipments.filter((e) => e.EQP_STATUS?.toLowerCase().includes('maintenance')).length;
  }, [equipments]);

  const brokenCount = useMemo(() => {
    return equipments.filter((e) => {
      const s = e.EQP_STATUS?.toLowerCase() || '';
      return s.includes('broken') || s.includes('damaged') || s.includes('retired');
    }).length;
  }, [equipments]);

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('functioning') || s.includes('active') || s.includes('operational')) return 'badge-success';
    if (s.includes('maintenance')) return 'badge-warning';
    if (s.includes('broken') || s.includes('damaged')) return 'badge-danger';
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
                Equipment Management
              </h1>
              <span className="badge-counter">
                {equipments.length} Models ({totalUnits} Units)
              </span>
            </div>
            <p className="text-muted mt-1">
              Maintain hospital medical machinery, calibration cycles, and inventory
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
              <span>Add New Equipment</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Equipment Models</p>
                <p className="text-2xl font-bold text-heading mt-1">{equipments.length}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-primary shadow-sm">
                <Wrench className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Functioning Normally</p>
                <p className="text-2xl font-bold text-heading mt-1">{functioningCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-success shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">In Maintenance</p>
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
                <p className="text-xs text-muted font-medium">Broken / Retired</p>
                <p className="text-2xl font-bold text-heading mt-1">{brokenCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-danger shadow-sm">
                <XCircle className="w-5 h-5" />
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
                placeholder="Search equipment by name, code, vendor, department, or status..."
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
                <p className="text-body font-medium">Loading hospital equipments...</p>
              </div>
            ) : filteredEquipments.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-muted text-muted border border-border">
                  <Wrench className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No equipment found</p>
                <p className="text-muted text-sm">Try adjusting your search query or register new equipment</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> Add Equipment
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-32">Code</th>
                      <th className="w-56">Equipment Name</th>
                      <th>Description</th>
                      <th className="w-44">Vendor</th>
                      <th className="w-36">Department</th>
                      <th className="w-24 text-center">Qty</th>
                      <th className="w-36">Status</th>
                      <th className="text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredEquipments.map((equipment, index) => (
                        <motion.tr
                          key={equipment.EQP_ID}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <td className="table-id-link">
                            {equipment.EQP_CODE || `EQP-${equipment.EQP_ID}`}
                          </td>
                          <td className="font-semibold text-heading">
                            <div className="flex items-center gap-2">
                              <Wrench className="w-4 h-4 text-primary shrink-0" />
                              {equipment.EQP_NAME}
                            </div>
                          </td>
                          <td className="text-muted text-sm max-w-xs truncate">
                            {equipment.EQP_DESC || '—'}
                          </td>
                          <td>
                            <span className="badge-tag-company">
                              <Building2 className="w-3 h-3 opacity-75" />
                              {equipment.EQP_VENDOR || 'General Supply'}
                            </span>
                          </td>
                          <td>
                            <DepartmentBadge department={equipment.EQP_DEPT} />
                          </td>
                          <td className="text-center font-mono font-semibold text-heading">
                            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-card border border-border text-foreground text-xs font-bold">
                              <Layers className="w-3 h-3 text-primary" />
                              {equipment.EQP_QTY || '1'}
                            </div>
                          </td>
                          <td>
                            <StatusBadge status={equipment.EQP_STATUS} showIcon />
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(equipment)}
                                className="table-action-edit hover-lift cursor-pointer"
                                title="Edit Equipment"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(equipment)}
                                disabled={safeDelete.isDeleting}
                                className="table-action-delete hover-lift cursor-pointer"
                                title="Delete Equipment"
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
          <EquipmentsForm
            equipment={editingEquipment}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
