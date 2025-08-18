'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2, X, Trash2, LogOut, CheckCircle2 } from 'lucide-react';
import { Button } from './button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
  icon?: 'trash' | 'logout' | 'alert';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  icon = 'trash',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const IconComponent = icon === 'logout' ? LogOut : icon === 'alert' ? AlertTriangle : Trash2;

  const iconBg =
    variant === 'danger'
      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      : variant === 'warning'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';

  const confirmBtnClass =
    variant === 'danger'
      ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-lg shadow-rose-500/25'
      : variant === 'warning'
      ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25'
      : 'bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white shadow-lg shadow-cyan-500/25';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Top colored accent line */}
            <div
              className={`h-1.5 w-full bg-gradient-to-r ${
                variant === 'danger'
                  ? 'from-rose-500 to-red-600'
                  : variant === 'warning'
                  ? 'from-amber-500 to-orange-600'
                  : 'from-sky-500 to-cyan-600'
              }`}
            />

            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl border shrink-0 ${iconBg}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-100">{title}</h3>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{description}</p>
                </div>
                {!isLoading && (
                  <button
                    onClick={onClose}
                    className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="bg-slate-800/50 hover:bg-slate-800 text-slate-300 border-slate-700 cursor-pointer"
                >
                  {cancelText}
                </Button>
                <Button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`${confirmBtnClass} font-semibold cursor-pointer min-w-[110px] flex items-center justify-center gap-2`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{confirmText}</span>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
