'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Loader2, DollarSign, CreditCard, Calendar, CheckCircle2, Clock, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PayrollsForm from './payrolls-form';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';

interface Payroll {
  PAY_ID: number;
  PAY_NUMBER: string;
  PAY_DOC_NAME: string;
  PAY_DOC_NUMBER: string;
  PAY_DOC_EMAIL: string;
  PAY_AMOUNT: number;
  PAY_PERIOD: string;
  PAY_STATUS: string;
  PAY_DATE: string;
  PAY_METHOD: string;
}

export default function PayrollsClient() {
  const safeDelete = useSafeDelete();
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState<Payroll | null>(null);

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async (skipCache = false) => {
    try {
      if (payrolls.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/payrolls');
      }
      const data = await fetchWithCache<Payroll[]>('/api/payrolls');
      setPayrolls(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      if (payrolls.length === 0) {
        toast.error('Failed to load payrolls');
        setPayrolls([]);
      }
    } finally {
      setLoading(false);
    }
  };

  function handleDelete(payroll: Payroll) {
    safeDelete.requestDelete({
      url: `/api/payrolls?id=${payroll.PAY_ID}`,
      itemType: 'Payroll Record',
      itemTitle: payroll.PAY_NUMBER || `Payroll #${payroll.PAY_ID}`,
      successMessage: 'Payroll record deleted successfully',
      onSuccess: () => fetchPayrolls(true),
    });
  }

  const handleEdit = (payroll: Payroll) => {
    setEditingPayroll(payroll);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingPayroll(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayroll(null);
  };

  const handleSuccess = () => {
    fetchPayrolls(true);
    handleCloseForm();
  };

  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((payroll) =>
      `${payroll.PAY_DOC_NAME || ''} ${payroll.PAY_DOC_NUMBER || ''} ${payroll.PAY_NUMBER || ''} ${payroll.PAY_PERIOD || ''} ${payroll.PAY_STATUS || ''} ${payroll.PAY_METHOD || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [payrolls, searchTerm]);

  // Dynamic KPI Stats
  const totalDisbursed = useMemo(() => {
    return payrolls.reduce((sum, p) => sum + (Number(p.PAY_AMOUNT) || 0), 0);
  }, [payrolls]);

  const paidCount = useMemo(() => {
    return payrolls.filter((p) => {
      const s = p.PAY_STATUS?.toLowerCase() || '';
      return s.includes('paid') || s.includes('completed') || s.includes('processed');
    }).length;
  }, [payrolls]);

  const pendingCount = useMemo(() => {
    return payrolls.filter((p) => {
      const s = p.PAY_STATUS?.toLowerCase() || '';
      return s.includes('pending') || s.includes('processing');
    }).length;
  }, [payrolls]);

  const avgSalary = useMemo(() => {
    return payrolls.length > 0 ? totalDisbursed / payrolls.length : 0;
  }, [payrolls, totalDisbursed]);

  const getStatusBadge = (status?: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('paid') || s.includes('completed') || s.includes('processed')) return 'badge-success';
    if (s.includes('pending') || s.includes('processing')) return 'badge-warning';
    if (s.includes('cancelled') || s.includes('failed')) return 'badge-danger';
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
                Payroll Management
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {payrolls.length} Records
              </span>
            </div>
            <p className="text-muted mt-1">
              Process medical staff salaries, stipends, bonuses, and disbursement cycles
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
              <span>Add Payroll Record</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Payroll Volume</p>
                <p className="text-2xl font-bold text-heading mt-1">
                  ${totalDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Disbursed / Paid</p>
                <p className="text-2xl font-bold text-heading mt-1">{paidCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Pending Processing</p>
                <p className="text-2xl font-bold text-heading mt-1">{pendingCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Average Disbursement</p>
                <p className="text-2xl font-bold text-heading mt-1">
                  ${avgSalary.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400">
                <CreditCard className="w-5 h-5" />
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
                placeholder="Search payrolls by staff name, employee number, payroll code, period, or method..."
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
                <p className="text-body font-medium">Loading payroll records...</p>
              </div>
            ) : filteredPayrolls.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-slate-800/80 text-muted border border-slate-700">
                  <DollarSign className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No payroll records found</p>
                <p className="text-muted text-sm">Try adjusting your search query or generate a new payroll entry</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> Add Payroll Record
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-32">Payroll No.</th>
                      <th className="w-56">Staff Member</th>
                      <th className="w-40">Period</th>
                      <th className="w-36">Amount</th>
                      <th className="w-36">Method</th>
                      <th className="w-36">Date</th>
                      <th className="w-32">Status</th>
                      <th className="text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredPayrolls.map((payroll, index) => (
                        <motion.tr
                          key={payroll.PAY_ID}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <td className="font-mono text-cyan-400 font-medium">
                            {payroll.PAY_NUMBER || `PAY-${payroll.PAY_ID}`}
                          </td>
                          <td className="font-semibold text-heading">
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                              <div>
                                <div>{payroll.PAY_DOC_NAME || 'Staff Member'}</div>
                                <div className="text-xs font-mono text-muted font-normal">{payroll.PAY_DOC_NUMBER}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                              <Calendar className="w-3 h-3 text-muted" />
                              <span>{payroll.PAY_PERIOD || 'Current'}</span>
                            </div>
                          </td>
                          <td className="font-semibold text-emerald-400 font-mono">
                            ${Number(payroll.PAY_AMOUNT || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td>
                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {payroll.PAY_METHOD || 'Bank Transfer'}
                            </span>
                          </td>
                          <td className="text-muted text-xs">
                            {formatDate(payroll.PAY_DATE)}
                          </td>
                          <td>
                            <Badge className={`badge ${getStatusBadge(payroll.PAY_STATUS)}`}>
                              {payroll.PAY_STATUS || 'Processed'}
                            </Badge>
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(payroll)}
                                className="hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all hover-lift cursor-pointer"
                                title="Edit Payroll"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(payroll)}
                                disabled={safeDelete.isDeleting}
                                className="hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all hover-lift cursor-pointer"
                                title="Delete Payroll"
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
          <PayrollsForm
            payroll={editingPayroll}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
