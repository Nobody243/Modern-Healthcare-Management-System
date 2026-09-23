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
import { fetchWithCache, invalidateApiCache } from '@/lib/api-cache';

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

  async function fetchAccounts(skipCache = false) {
    try {
      if (accounts.length === 0) setLoading(true);
      if (skipCache) {
        invalidateApiCache('/api/accounts');
      }
      const data = await fetchWithCache<Account[]>('/api/accounts');
      setAccounts(Array.isArray(data) ? data : []);
    } catch (error) {
      if (accounts.length === 0) {
        toast.error((error as Error).message || 'Failed to fetch accounts');
        setAccounts([]);
      }
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
      onSuccess: () => fetchAccounts(true),
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
    fetchAccounts(true);
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1"
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-heading tracking-tight">
                Financial Accounts
              </h1>
              <span className="badge-counter">
                {accounts.length} Total
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Fiscal accounting ledgers, operating assets, and financial accounts
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
              <span>Add New Account</span>
            </Button>
          </motion.div>
        </div>

        {/* Bento KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Total Balance</p>
                <p className="text-2xl font-bold text-heading mt-1">
                  ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-success shadow-sm">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Active Accounts</p>
                <p className="text-2xl font-bold text-heading mt-1">{accounts.length}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-primary shadow-sm">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Asset Accounts</p>
                <p className="text-2xl font-bold text-heading mt-1">{assetCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-info shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="card p-4 border border-border/70 hover:border-border transition-all bg-card/40 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted font-medium">Liability Accounts</p>
                <p className="text-2xl font-bold text-heading mt-1">{liabilityCount}</p>
              </div>
              <div className="p-2.5 rounded-xl kpi-icon-warning shadow-sm">
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
          <Card className="card-glass p-4 border border-border/70 shadow-md backdrop-blur-md">
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
          <Card className="card overflow-hidden border border-border/70 shadow-xl bg-card/60 backdrop-blur-xl relative">
            <div className="card-accent-bar" />
            {loading ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-body font-medium">Loading financial accounts...</p>
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="p-3 rounded-full bg-muted text-muted-foreground border border-border">
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
                          <td className="table-id-link">
                            #{account.ACC_ID}
                          </td>
                          <td className="font-semibold text-heading">
                            <div className="flex items-center gap-2">
                              <Wallet className="w-4 h-4 text-primary shrink-0" />
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
                          <td className="font-semibold text-kpi-success font-mono">
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
                                className="table-action-edit hover-lift cursor-pointer"
                                title="Edit Account"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(account)}
                                disabled={safeDelete.isDeleting}
                                className="table-action-delete hover-lift cursor-pointer"
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
