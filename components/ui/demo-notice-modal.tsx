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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0 }}
            className="relative w-full max-w-lg bg-slate-900/95 border border-amber-500/30 rounded-2xl shadow-2xl shadow-amber-500/10 overflow-hidden z-10 backdrop-blur-xl"
          >
            {/* Top gradient glowing bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

            <div className="p-6 sm:p-7 space-y-5">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="relative p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 shadow-inner">
                  <ShieldAlert className="w-7 h-7" />
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 animate-ping opacity-75" />
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center">
                    <Lock className="w-2 h-2 text-slate-950" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Demo Mode Safeguard</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 tracking-tight">{title}</h3>
                </div>

                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Notice Box */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5 text-sm">
                <p className="text-slate-300 leading-relaxed">
                  {description}
                </p>
                <div className="flex items-start gap-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    You can still freely <strong className="text-slate-200 font-medium">view, create, search, and update</strong> records throughout the demo session.
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-end pt-2">
                <Button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
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
