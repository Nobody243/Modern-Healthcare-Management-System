'use client';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Syringe, 
  HeartPulse, 
  FlaskConical, 
  UserCircle, 
  LogOut, 
  Menu, 
  X, 
  ClipboardList, 
  ArrowRightLeft 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { preloadApi } from '@/lib/api-cache';

import { ConfirmModal } from '@/components/ui/confirm-modal';

interface DoctorLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/doctor/dashboard', api: '/api/doctors/me' },
  { icon: Users, label: 'My Patients', href: '/doctor/patients', api: '/api/doctor/patients' },
  { icon: FileText, label: 'Prescriptions', href: '/doctor/prescriptions', api: '/api/doctor/prescriptions' },
  { icon: Syringe, label: 'Surgeries', href: '/doctor/surgeries', api: '/api/doctor/surgeries' },
  { icon: HeartPulse, label: 'Vitals', href: '/doctor/vitals', api: '/api/doctor/vitals' },
  { icon: FlaskConical, label: 'Lab Results', href: '/doctor/laboratory', api: '/api/doctor/laboratory' },
  { icon: ArrowRightLeft, label: 'Patient Transfers', href: '/doctor/patient-transfers', api: '/api/doctor/patient-transfers' },
  { icon: ClipboardList, label: 'Medical Records', href: '/doctor/records', api: '/api/doctor/records' },
  { icon: UserCircle, label: 'Profile', href: '/doctor/profile', api: '/api/doctors/me' },
];

export default function DoctorLayout({ children, user }: DoctorLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
    <div className="min-h-screen bg-hospital-gradient-emerald transition-colors duration-300">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          {sidebarOpen ? <X className="text-gray-900 dark:text-gray-100" /> : <Menu className="text-gray-900 dark:text-gray-100" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg z-40 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">HMS Doctor</h1>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-medium">Dr. {user.name}</p>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-220px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onMouseEnter={() => item.api && preloadApi(item.api)}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                  isActive
                    ? "text-white font-semibold"
                    : "text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-300"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="doctorSidebarActivePill"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/30"
                    transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.6 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
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
        title="Sign Out of Doctor Portal"
        description="Are you sure you want to end your current clinical session and sign out?"
        confirmText="Sign Out"
        cancelText="Stay Signed In"
        variant="danger"
        icon="logout"
      />
    </div>
  );
}
