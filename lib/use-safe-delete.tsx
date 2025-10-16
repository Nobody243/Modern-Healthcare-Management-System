'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { DemoNoticeModal } from '@/components/ui/demo-notice-modal';

export interface DeleteOptions {
  url: string;
  itemType?: string; // e.g. "Doctor", "Patient", "Prescription", "Transfer Record"
  itemTitle?: string; // e.g. "Dr. Sarah Jenkins" or "John Doe"
  confirmTitle?: string;
  confirmDescription?: string;
  successMessage?: string;
  onSuccess?: () => void | Promise<void>;
}

export function useSafeDelete() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [demoNoticeOpen, setDemoNoticeOpen] = useState(false);
  const [demoNoticeMsg, setDemoNoticeMsg] = useState<string | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<DeleteOptions | null>(null);

  const requestDelete = useCallback((options: DeleteOptions) => {
    setPendingDelete(options);
    setConfirmOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!pendingDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await fetch(pendingDelete.url, {
        method: 'DELETE',
      });

      const data = await res.json().catch(() => ({}));

      // Check for Demo Account restriction
      if (res.status === 403 || data?.isDemoRestriction) {
        setConfirmOpen(false);
        setDemoNoticeMsg(
          data?.error ||
            '🔒 Deletion is restricted for public demo accounts to preserve sample clinical records.'
        );
        setDemoNoticeOpen(true);
        return;
      }

      if (!res.ok) {
        setConfirmOpen(false);
        toast.error(data?.error || `Failed to delete ${pendingDelete.itemType?.toLowerCase() || 'item'}`);
        return;
      }

      setConfirmOpen(false);
      const entityName = pendingDelete.itemType || 'Record';
      toast.success(
        pendingDelete.successMessage || `${entityName} deleted successfully`
      );

      if (pendingDelete.onSuccess) {
        await pendingDelete.onSuccess();
      }
    } catch (err) {
      console.error('Safe delete error:', err);
      setConfirmOpen(false);
      toast.error('An unexpected error occurred while processing deletion.');
    } finally {
      setIsDeleting(false);
    }
  }, [pendingDelete, isDeleting]);

  const closeConfirm = useCallback(() => {
    if (!isDeleting) {
      setConfirmOpen(false);
      setPendingDelete(null);
    }
  }, [isDeleting]);

  const closeDemoNotice = useCallback(() => {
    setDemoNoticeOpen(false);
  }, []);

  return {
    requestDelete,
    confirmOpen,
    demoNoticeOpen,
    demoNoticeMsg,
    isDeleting,
    pendingDelete,
    handleConfirm,
    closeConfirm,
    closeDemoNotice,
  };
}

export function SafeDeleteDialogs({
  state,
}: {
  state: ReturnType<typeof useSafeDelete>;
}) {
  const itemType = state.pendingDelete?.itemType || 'Record';
  const itemTitle = state.pendingDelete?.itemTitle;

  const title =
    state.pendingDelete?.confirmTitle ||
    `Delete ${itemType}?`;

  const description =
    state.pendingDelete?.confirmDescription ||
    (itemTitle
      ? `Are you sure you want to permanently delete "${itemTitle}"? This action cannot be undone.`
      : `Are you sure you want to permanently delete this ${itemType.toLowerCase()}? This action cannot be undone.`);

  return (
    <>
      <ConfirmModal
        isOpen={state.confirmOpen}
        onClose={state.closeConfirm}
        onConfirm={state.handleConfirm}
        isLoading={state.isDeleting}
        title={title}
        description={description}
        confirmText={`Delete ${itemType}`}
        cancelText="Cancel"
        variant="danger"
        icon="trash"
      />
      <DemoNoticeModal
        isOpen={state.demoNoticeOpen}
        onClose={state.closeDemoNotice}
        description={state.demoNoticeMsg}
      />
    </>
  );
}
