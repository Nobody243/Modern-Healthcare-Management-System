'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Pill, 
  FlaskConical, 
  Activity, 
  Scissors, 
  LogOut, 
  User, 
  FileHeart 
} from 'lucide-react';
import { preloadApi } from '@/lib/api-cache';

import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface PatientLayoutProps {
  children: ReactNode;
}

export default function PatientLayout({ children }: PatientLayoutProps) {
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    { href: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard, api: '/api/vitals' },
    { href: '/patient/prescriptions', label: 'My Prescriptions', icon: Pill, api: '/api/prescriptions' },
    { href: '/patient/laboratory', label: 'Lab Results', icon: FlaskConical, api: '/api/laboratory' },
    { href: '/patient/vitals', label: 'Vital Signs', icon: Activity, api: '/api/vitals' },
    { href: '/patient/surgeries', label: 'Surgeries', icon: Scissors, api: '/api/surgery' },
    { href: '/patient/records', label: 'Medical Records', icon: FileHeart, api: '/api/records' },
    { href: '/patient/profile', label: 'My Profile', icon: User, api: '/api/patient/update-profile' },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 shadow-xl z-40">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <Link href="/patient/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Patient Portal</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">My Health Records</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    onMouseEnter={() => item.api && preloadApi(item.api)}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="patientSidebarActivePill"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/20"
                        transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.6 }}
                      />
                    )}
                    <Icon className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLogoutOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 md:p-8 min-h-screen animate-fade-in w-full lg:w-[calc(100%-16rem)]">
        <div className="w-full space-y-6">
          {children}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={logoutOpen}
        onClose={() => !isLoggingOut && setLogoutOpen(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
        title="Sign Out of Patient Portal"
        description="Are you sure you want to log out of your personal health portal?"
        confirmText="Sign Out"
        cancelText="Stay Signed In"
        variant="danger"
        icon="logout"
      />
    </div>
  );
}
