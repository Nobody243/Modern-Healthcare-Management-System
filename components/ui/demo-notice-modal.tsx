'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, Sparkles, Check, Lock } from 'lucide-react';
import { Button } from './button';

interface DemoNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function DemoNoticeModal({
  isOpen,
  onClose,
  title = 'Demo Account Protection',
  description = 'Data deletion and permanent record removal are disabled in Demo Mode to preserve sample healthcare records, vitals, and appointments for all prospective evaluators.',
}: DemoNoticeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0 }}
            className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 backdrop-blur-xl text-card-foreground"
          >
            {/* Top gradient glowing bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[rgb(var(--kpi-warning-from))] to-[rgb(var(--kpi-warning-to))]" />

            <div className="p-6 sm:p-7 space-y-5">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="relative p-3.5 rounded-2xl bg-kpi-warning-subtle text-kpi-warning border border-kpi-warning-subtle shrink-0 shadow-inner">
                  <ShieldAlert className="w-7 h-7" />
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[rgb(var(--kpi-warning-icon))] animate-ping opacity-75" />
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[rgb(var(--kpi-warning-from))] flex items-center justify-center">
                    <Lock className="w-2 h-2 text-primary-foreground" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-kpi-warning-subtle text-kpi-warning border border-kpi-warning-subtle mb-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Demo Mode Safeguard</span>
                  </div>
                  <h3 className="text-xl font-bold text-heading tracking-tight">{title}</h3>
                </div>

                <button
                  onClick={onClose}
                  className="text-muted hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Notice Box */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2.5 text-sm">
                <p className="text-muted leading-relaxed">
                  {description}
                </p>
                <div className="flex items-start gap-2 pt-2 border-t border-border text-xs text-muted">
                  <Check className="w-4 h-4 text-kpi-success shrink-0 mt-0.5" />
                  <span>
                    You can still freely <strong className="text-heading font-medium">view, create, search, and update</strong> records throughout the demo session.
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-end pt-2">
                <Button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[rgb(var(--kpi-warning-from))] to-[rgb(var(--kpi-warning-to))] text-white font-semibold rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Understood, Continue Exploring
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
