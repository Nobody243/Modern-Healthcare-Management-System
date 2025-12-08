'use client';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Pill, AlertTriangle, CheckCircle2, Package, Layers, Building2, Tag, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PharmaceuticalForm, Pharmaceutical } from './pharmaceutical-form';
import { toast } from 'sonner';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';
import { exportToCSV } from '@/lib/export-csv';
import { SortableHeader, SortOrder } from '@/components/ui/sortable-header';
import { TablePagination } from '@/components/ui/table-pagination';

export default function PharmaceuticalsClient() {
  const [pharmaceuticals, setPharmaceuticals] = useState<Pharmaceutical[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPharmaceutical, setSelectedPharmaceutical] = useState<Pharmaceutical | undefined>();
  const [sortKey, setSortKey] = useState<string>('PHAR_NAME');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
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

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const sortedAndFilteredPharmaceuticals = useMemo(() => {
    const list = pharmaceuticals.filter((item) =>
      `${item.PHAR_NAME || ''} ${item.PHAR_BCODE || ''} ${item.PHAR_CAT || ''} ${item.PHAR_VENDOR || ''} ${item.PHAR_DESC || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    return list.sort((a, b) => {
      let aVal: any = a[sortKey as keyof Pharmaceutical] || '';
      let bVal: any = b[sortKey as keyof Pharmaceutical] || '';

      if (sortKey === 'PHAR_QTY') {
        aVal = Number(a.PHAR_QTY) || 0;
        bVal = Number(b.PHAR_QTY) || 0;
      }

      if (typeof aVal === 'string') {
        const cmp = aVal.localeCompare(String(bVal));
        return sortOrder === 'asc' ? cmp : -cmp;
      }
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });
  }, [pharmaceuticals, searchTerm, sortKey, sortOrder]);

  const paginatedPharmaceuticals = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedAndFilteredPharmaceuticals.slice(start, start + pageSize);
  }, [sortedAndFilteredPharmaceuticals, currentPage, pageSize]);

  const handleExportCSV = () => {
    exportToCSV(
      `Pharmaceuticals_Inventory_${new Date().toISOString().split('T')[0]}`,
      sortedAndFilteredPharmaceuticals,
      [
        { header: 'Barcode', accessor: 'PHAR_BCODE' },
        { header: 'Medicine Name', accessor: 'PHAR_NAME' },
        { header: 'Category', accessor: 'PHAR_CAT' },
        { header: 'Vendor', accessor: 'PHAR_VENDOR' },
        { header: 'Stock Qty', accessor: 'PHAR_QTY' },
        { header: 'Description', accessor: 'PHAR_DESC' },
      ]
    );
    toast.success(`Exported ${sortedAndFilteredPharmaceuticals.length} pharmaceutical records to CSV`);
  };

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
              <span className="badge-counter">
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
            className="flex items-center gap-2.5 flex-wrap"
          >
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="border-border text-foreground hover:bg-muted/80 flex items-center gap-2 cursor-pointer"
              title="Download CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </Button>
            <Button
              onClick={handleAddNew}
              className="btn-primary flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Pharmaceutical</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Formulary Drugs</p>
                <p className="text-2xl font-bold text-heading mt-1">{pharmaceuticals.length}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-primary shadow-sm">
                <Pill className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Adequate Stock</p>
                <p className="text-2xl font-bold text-heading mt-1">{healthyStockItems}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-success shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Low Stock Warning (&lt;50)</p>
                <p className="text-2xl font-bold text-heading mt-1">{lowStockItems}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-warning shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Inventory Units</p>
                <p className="text-2xl font-bold text-heading mt-1">{totalUnits.toLocaleString()}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-info shadow-sm">
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
          <Card className="card-glass p-4 border border-border/70 shadow-md backdrop-blur-md">
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
          <Card className="card overflow-hidden border border-border/70 shadow-xl bg-card/60 backdrop-blur-xl relative">
            <div className="card-accent-bar" />
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-body font-medium">Loading pharmaceuticals inventory...</p>
              </div>
            ) : sortedAndFilteredPharmaceuticals.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-muted text-muted border border-border">
                  <Pill className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No pharmaceuticals found</p>
                <p className="text-muted text-sm">Try adjusting your search query or add a new drug</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> Add Pharmaceutical
                </Button>
              </div>
            ) : (
              <div>
                <div className="overflow-x-auto">
                  <table className="table-hospital">
                    <thead>
                      <tr>
                        <th className="w-32">
                          <SortableHeader
                            label="Barcode"
                            columnKey="PHAR_BCODE"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                        <th className="w-56">
                          <SortableHeader
                            label="Medicine Name"
                            columnKey="PHAR_NAME"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                        <th className="w-44">
                          <SortableHeader
                            label="Category"
                            columnKey="PHAR_CAT"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                        <th className="w-48">
                          <SortableHeader
                            label="Vendor"
                            columnKey="PHAR_VENDOR"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            onSort={handleSort}
                          />
                        </th>
                        <th className="w-28 text-center">
                          <SortableHeader
                            label="Stock"
                            columnKey="PHAR_QTY"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            onSort={handleSort}
                            align="center"
                          />
                        </th>
                        <th>Description</th>
                        <th className="text-right w-28">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {paginatedPharmaceuticals.map((item, index) => {
                          const qty = Number(item.PHAR_QTY) || 0;
                          const isLowStock = qty < 50;
                          return (
                            <motion.tr
                              key={item.PHAR_ID}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -15 }}
                              transition={{ delay: index * 0.02 }}
                            >
                              <td className="table-id-link">
                                {item.PHAR_BCODE}
                              </td>
                              <td className="font-semibold text-heading">
                                <div className="flex items-center gap-2">
                                  <Pill className="w-4 h-4 text-primary shrink-0" />
                                  <span>{item.PHAR_NAME}</span>
                                </div>
                              </td>
                              <td>
                                <Badge variant="pharma" className="badge-tag-pharma">
                                  <Tag className="w-3 h-3 opacity-70" />
                                  {item.PHAR_CAT || 'General'}
                                </Badge>
                              </td>
                              <td>
                                <span className="badge-tag-company">
                                  <Building2 className="w-3 h-3 opacity-75" />
                                  {item.PHAR_VENDOR || 'Direct Supply'}
                                </span>
                              </td>
                              <td className="text-center">
                                <span
                                  className={`inline-flex items-center gap-1 font-mono font-bold px-2.5 py-0.5 rounded-full text-xs ${
                                    isLowStock
                                      ? 'badge-theme-danger animate-pulse'
                                      : 'badge-theme-success'
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
                                    className="table-action-edit hover-lift cursor-pointer"
                                    title="Edit Medication"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDelete(item)}
                                    disabled={safeDelete.isDeleting}
                                    className="table-action-delete hover-lift cursor-pointer"
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

                <TablePagination
                  currentPage={currentPage}
                  totalItems={sortedAndFilteredPharmaceuticals.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
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
