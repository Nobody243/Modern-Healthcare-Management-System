'use client';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Account {
  ACC_ID: number;
  ACC_NAME: string;
  ACC_DESC: string;
  ACC_TYPE: string;
  ACC_NUMBER: string;
  ACC_AMOUNT: string;
}

interface AccountsFormProps {
  open: boolean;
  onClose: () => void;
  account: Account | null;
}

export default function AccountsForm({ open, onClose, account }: AccountsFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    type: 'Savings',
    number: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.ACC_NAME || '',
        desc: account.ACC_DESC || '',
        type: account.ACC_TYPE || 'Savings',
        number: account.ACC_NUMBER || '',
        amount: account.ACC_AMOUNT || '',
      });
    } else {
      setFormData({
        name: '',
        desc: '',
        type: 'Savings',
        number: '',
        amount: '',
      });
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/accounts';
      const method = account ? 'PUT' : 'POST';
      
      const body = account
        ? { ...formData, id: account.ACC_ID }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save account');

      toast.success(`Account ${account ? 'updated' : 'created'} successfully`);

      onClose();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent key={account?.ACC_ID || 'new'} className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-heading">{account ? 'Edit Account' : 'Add New Account'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-muted">Account Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="input-hospital"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-semibold text-muted">Account Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="select-hospital">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card text-card-foreground border-border">
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Checking">Checking</SelectItem>
                  <SelectItem value="Revenue">Revenue</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                  <SelectItem value="Payroll">Payroll</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number" className="text-sm font-semibold text-muted">Account Number</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                required
                className="input-hospital"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold text-muted">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="input-hospital"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc" className="text-sm font-semibold text-muted">Description</Label>
            <Textarea
              id="desc"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              rows={3}
              className="textarea-hospital"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="btn-secondary">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="btn-primary cursor-pointer">
              {loading ? 'Saving...' : account ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
