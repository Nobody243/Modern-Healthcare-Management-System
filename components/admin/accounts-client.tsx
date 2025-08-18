'use client';
import { useSafeDelete, SafeDeleteDialogs } from '@/lib/use-safe-delete';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Search, Loader2, Wallet, DollarSign, TrendingUp, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import AccountsForm from './accounts-form';

interface Account {
  ACC_ID: number;
  ACC_NAME: string;
  ACC_DESC: string;
  ACC_TYPE: string;
  ACC_NUMBER: string;
  ACC_AMOUNT: string;
}

export default function AccountsClient() {
  const safeDelete = useSafeDelete();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      setLoading(true);
      const response = await fetch('/api/accounts');
      if (!response.ok) throw new Error('Failed to fetch accounts');
      const data = await response.json();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to fetch accounts');
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(account: Account) {
    safeDelete.requestDelete({
      url: `/api/accounts?id=${account.ACC_ID}`,
      itemType: 'Account',
      itemTitle: account.ACC_NAME,
      successMessage: 'Account deleted successfully',
      onSuccess: fetchAccounts,
    });
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingAccount(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingAccount(null);
    fetchAccounts();
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) =>
      `${account.ACC_NAME} ${account.ACC_NUMBER} ${account.ACC_TYPE} ${account.ACC_DESC || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [accounts, searchTerm]);

  // Dynamic KPI Stats
  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, curr) => acc + (parseFloat(curr.ACC_AMOUNT) || 0), 0);
  }, [accounts]);

  const assetCount = useMemo(() => {
    return accounts.filter((a) => a.ACC_TYPE?.toLowerCase().includes('asset')).length;
  }, [accounts]);

  const liabilityCount = useMemo(() => {
    return accounts.filter((a) => a.ACC_TYPE?.toLowerCase().includes('liability')).length;
  }, [accounts]);

  const getAccountTypeBadge = (type: string) => {
    const lower = type?.toLowerCase() || '';
    if (lower.includes('asset')) return 'badge-success';
    if (lower.includes('liability')) return 'badge-danger';
    if (lower.includes('receivable')) return 'badge-purple';
    if (lower.includes('payable')) return 'badge-warning';
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
                Financial Accounts
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {accounts.length} Total
              </span>
            </div>
            <p className="text-muted mt-1">
              Manage hospital fiscal ledgers, asset accounts, and liabilities
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
              <span>Add New Account</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Balance</p>
                <p className="text-2xl font-bold text-heading mt-1">
                  ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                <p className="text-xs text-muted font-medium">Active Accounts</p>
                <p className="text-2xl font-bold text-heading mt-1">{accounts.length}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Asset Accounts</p>
                <p className="text-2xl font-bold text-heading mt-1">{assetCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-slate-700/50 hover:border-slate-600 transition-all bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Liability Accounts</p>
                <p className="text-2xl font-bold text-heading mt-1">{liabilityCount}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
                <TrendingUp className="w-5 h-5" />
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
                placeholder="Search accounts by title, account number, or classification..."
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
                <p className="text-body font-medium">Loading financial accounts...</p>
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-slate-800/80 text-muted border border-slate-700">
                  <Wallet className="w-8 h-8" />
                </div>
                <p className="text-body font-medium text-lg">No accounts found</p>
                <p className="text-muted text-sm">Try adjusting your search query or add a new account</p>
                <Button onClick={handleAddNew} className="btn-primary mt-2">
                  <Plus className="w-4 h-4 mr-1.5" /> Add Account
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-hospital">
                  <thead>
                    <tr>
                      <th className="w-24">ID</th>
                      <th className="w-56">Account Name</th>
                      <th className="w-44">Type</th>
                      <th className="w-44">Account Number</th>
                      <th className="w-40">Amount</th>
                      <th>Description</th>
                      <th className="text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredAccounts.map((account, index) => (
                        <motion.tr
                          key={account.ACC_ID}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <td className="font-mono text-cyan-400 font-medium">
                            #{account.ACC_ID}
                          </td>
                          <td className="font-semibold text-heading">
                            <div className="flex items-center gap-2">
                              <Wallet className="w-4 h-4 text-cyan-400 shrink-0" />
                              {account.ACC_NAME}
                            </div>
                          </td>
                          <td>
                            <Badge className={`badge ${getAccountTypeBadge(account.ACC_TYPE)}`}>
                              {account.ACC_TYPE}
                            </Badge>
                          </td>
                          <td className="font-mono text-xs text-muted font-medium">
                            {account.ACC_NUMBER}
                          </td>
                          <td className="font-semibold text-emerald-400 font-mono">
                            ${parseFloat(account.ACC_AMOUNT || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="text-muted text-sm max-w-xs truncate">
                            {account.ACC_DESC || '—'}
                          </td>
                          <td className="text-right">
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(account)}
                                className="hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all hover-lift cursor-pointer"
                                title="Edit Account"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(account)}
                                disabled={safeDelete.isDeleting}
                                className="hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all hover-lift cursor-pointer"
                                title="Delete Account"
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

      <AccountsForm
        open={isFormOpen}
        onClose={handleFormClose}
        account={editingAccount}
      />

      <SafeDeleteDialogs state={safeDelete} />
    </>
  );
}
