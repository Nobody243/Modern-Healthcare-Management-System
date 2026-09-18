'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, Tags, Pill, Building2, Layers, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PharmaceuticalCategoriesForm from './pharmaceutical-categories-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';

interface PharmaceuticalCategory {
  PHARM_CAT_ID: number;
  PHARM_CAT_NAME: string;
  PHARM_CAT_VENDOR: string;
  PHARM_CAT_DESC: string;
}

export default function PharmaceuticalCategoriesClient() {
  const safeDelete = useSafeDelete();
  const [categories, setCategories] = useState<PharmaceuticalCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PharmaceuticalCategory | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (skipCache = false) => {
    try {
      if (categories.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/pharmaceutical-categories');
      }
      const data = await fetchWithCache<PharmaceuticalCategory[]>('/api/pharmaceutical-categories');
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (categories.length === 0) {
        toast.error('Failed to load pharmaceutical categories');
        setCategories([]);
      }
    } finally {
      setLoading(false);
    }
  };

  function handleDelete(category: PharmaceuticalCategory) {
    safeDelete.requestDelete({
      url: `/api/pharmaceutical-categories?id=${category.PHARM_CAT_ID}`,
      itemType: 'Category',
      itemTitle: category.PHARM_CAT_NAME,
      successMessage: 'Category deleted successfully',
      onSuccess: () => fetchCategories(true),
    });
  }

  const handleEdit = (category: PharmaceuticalCategory) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSuccess = () => {
    fetchCategories(true);
    handleCloseForm();
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      `${category.PHARM_CAT_NAME || ''} ${category.PHARM_CAT_VENDOR || ''} ${category.PHARM_CAT_DESC || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Unique vendors linked
  const uniqueVendors = useMemo(() => {
    const set = new Set(categories.map((c) => c.PHARM_CAT_VENDOR).filter(Boolean));
    return set.size;
  }, [categories]);

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
                Pharmaceutical Categories
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {categories.length} Categories
              </span>
            </div>
            <p className="text-muted mt-1">
              Classify pharmacy medication types, formulary divisions, and active drug groups
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
              <span>Add New Category</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Drug Categories</p>
                <p className="text-2xl font-bold text-heading mt-1">{categories.length}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
                <Tags className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Linked Pharma Suppliers</p>
                <p className="text-2xl font-bold text-heading mt-1">{uniqueVendors}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Formulary Status</p>
                <p className="text-2xl font-bold text-heading mt-1">Active (100%)</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400">
                <Layers className="w-5 h-5" />
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
                placeholder="Search categories by name, associated vendor, or notes..."
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
                <p className="text-body font-medium">Loading pharmaceutical categories...</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-slate-800/80 text-muted border border-slate-700">
                  <Tags className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No categories found</p>
                <p className="text-muted text-sm">Try adjusting your search query or add a new drug category</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> Add Category
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-24">ID</th>
                      <th className="w-64">Category Name</th>
                      <th className="w-56">Associated Vendor</th>
                      <th>Description & Usage</th>
                      <th className="text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredCategories.map((category, index) => (
                        <motion.tr
                          key={category.PHARM_CAT_ID}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <td className="font-mono text-cyan-400 font-medium">
                            #{category.PHARM_CAT_ID}
                          </td>
                          <td className="font-semibold text-heading">
                            <div className="flex items-center gap-2">
                              <Bookmark className="w-4 h-4 text-cyan-400 shrink-0" />
                              <span className="font-semibold text-heading">{category.PHARM_CAT_NAME}</span>
                            </div>
                          </td>
                          <td className="text-body text-sm font-medium">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-muted" />
                              <span>{category.PHARM_CAT_VENDOR || 'General Formulary'}</span>
                            </div>
                          </td>
                          <td className="text-muted text-sm max-w-md truncate">
                            {category.PHARM_CAT_DESC || '—'}
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(category)}
                                className="hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all hover-lift cursor-pointer"
                                title="Edit Category"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(category)}
                                disabled={safeDelete.isDeleting}
                                className="hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all hover-lift cursor-pointer"
                                title="Delete Category"
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
          <PharmaceuticalCategoriesForm
            category={editingCategory}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
