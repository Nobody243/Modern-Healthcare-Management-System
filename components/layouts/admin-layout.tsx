'use client';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Pill, 
  FlaskConical, 
  Syringe,
  HeartPulse,
  FileText,
  DollarSign,
  Package,
  LogOut,
  Menu,
  X,
  Building2,
  Wrench,
  Tags,
  ArrowLeftRight,
  Clipboard,
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { preloadApi } from '@/lib/api-cache';

import { UserSession } from '@/lib/auth';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface AdminLayoutProps {
  children: React.ReactNode;
  user?: UserSession | { name?: string; email?: string; role?: string } | null;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard', api: '/api/patients' },
  { icon: Users, label: 'Patients', href: '/admin/patients', api: '/api/patients' },
  { icon: UserCog, label: 'Doctors', href: '/admin/doctors', api: '/api/doctors' },
  { icon: Pill, label: 'Pharmaceuticals', href: '/admin/pharmaceuticals', api: '/api/pharmaceuticals' },
  { icon: Tags, label: 'Pharm Categories', href: '/admin/pharmaceutical-categories', api: '/api/pharmaceutical-categories' },
  { icon: FlaskConical, label: 'Laboratory', href: '/admin/laboratory', api: '/api/laboratory' },
  { icon: Syringe, label: 'Surgery', href: '/admin/surgery', api: '/api/surgery' },
  { icon: HeartPulse, label: 'Vitals', href: '/admin/vitals', api: '/api/vitals' },
  { icon: FileText, label: 'Medical Records', href: '/admin/records', api: '/api/records' },
  { icon: Clipboard, label: 'Prescriptions', href: '/admin/prescriptions', api: '/api/prescriptions' },
  { icon: DollarSign, label: 'Payrolls', href: '/admin/payrolls', api: '/api/payrolls' },
  { icon: Wallet, label: 'Accounts', href: '/admin/accounts', api: '/api/accounts' },
  { icon: Package, label: 'Assets', href: '/admin/assets', api: '/api/assets' },
  { icon: Wrench, label: 'Equipments', href: '/admin/equipments', api: '/api/equipments' },
  { icon: Building2, label: 'Vendors', href: '/admin/vendors', api: '/api/vendors' },
  { icon: ArrowLeftRight, label: 'Patient Transfers', href: '/admin/patient-transfers', api: '/api/patient-transfers' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
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
    <div className="min-h-screen bg-hospital-gradient transition-colors duration-300">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 sidebar backdrop-blur-xl shadow-2xl z-40 transition-all duration-300 animate-slide-in-left",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-gradient-medical">HMS Admin</h1>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium">System Administrator</p>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-220px)]">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onMouseEnter={() => item.api && preloadApi(item.api)}
                style={{ animationDelay: `${index * 0.05}s` }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover-lift animate-fade-in",
                  isActive
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 text-white shadow-lg shadow-sky-500/30"
                    : "text-slate-900 dark:text-white hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-400"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 hover-lift cursor-pointer"
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
        title="Sign Out of HMS Admin"
        description="Are you sure you want to end your current administrative session and sign out?"
        confirmText="Sign Out"
        cancelText="Stay Signed In"
        variant="danger"
        icon="logout"
      />
    </div>
  );
}
