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
  Wallet,
  Shield,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { preloadApi } from '@/lib/api-cache';
import { UserSession } from '@/lib/auth';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { ThemeToggle } from '@/components/theme-toggle';

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

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('curewell_admin_sidebar_collapsed');
      if (stored !== null) {
        setIsCollapsed(stored === 'true');
      }
    } catch (_) {}
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('curewell_admin_sidebar_collapsed', String(next));
      } catch (_) {}
      return next;
    });
  };

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
      setLogoutOpen(false);
    }
  };

  // Find active nav label for mobile header
  const activeNavItem = navItems.find((item) => item.href === pathname);
  const currentTitle = activeNavItem ? activeNavItem.label : 'Operations';

  return (
    <div className="portal-admin min-h-screen bg-background text-foreground flex flex-col">
      {/* ========================================================================= */}
      {/* 1. MOBILE & TABLET STICKY TOP NAVIGATION BAR (< lg)                      */}
      {/* ========================================================================= */}
      <header className="lg:hidden sticky top-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-xl border-b border-border z-40 px-4 sm:px-6 flex items-center justify-between shadow-md shrink-0">
        {/* Brand & Active Breadcrumb */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[rgb(var(--portal-admin-from))] to-[rgb(var(--portal-admin-to))] flex items-center justify-center shadow-md text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-base tracking-tight text-heading">CureWell</span>
              <span className="badge badge-theme-primary text-[9px] uppercase font-bold ml-1.5 px-1.5 py-0.2 bg-[rgb(var(--portal-subtle))] text-[rgb(var(--portal-primary))] border-[rgb(var(--portal-primary))]/30">Admin</span>
            </div>
          </Link>

          <div className="hidden sm:flex items-center text-muted-foreground text-xs font-medium">
            <ChevronRight className="w-3.5 h-3.5 mx-1 shrink-0" />
            <span className="text-foreground font-semibold truncate max-w-[140px]">{currentTitle}</span>
          </div>

          <div className="sm:hidden flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-bold text-heading truncate block max-w-[140px]">{currentTitle}</span>
          </div>
        </div>

        {/* User Snippet, Theme Toggle & Hamburger */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 border border-border text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-kpi-info-subtle border border-border animate-pulse" />
            <span className="text-muted-foreground truncate max-w-[120px]">{user?.name || 'ADMIN'}</span>
          </div>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl bg-muted/80 hover:bg-muted text-foreground border border-border/80 transition-colors cursor-pointer shadow-sm active:scale-95 flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-[rgb(var(--portal-primary))]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MOBILE & TABLET SLIDING SHEET DRAWER + BACKDROP (< lg)                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="lg:hidden">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Sliding Drawer Container */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 w-[290px] sm:w-80 bg-card border-r border-border shadow-2xl z-[70] flex flex-col h-full overflow-hidden"
            >
              {/* Drawer Header (Fixed Height) */}
              <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between shrink-0 bg-card">
                <Link
                  href="/admin/dashboard"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgb(var(--portal-admin-from))] to-[rgb(var(--portal-admin-to))] flex items-center justify-center shadow-lg text-white">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h1 className="text-lg font-extrabold text-heading">CureWell</h1>
                      <span className="badge badge-theme-primary text-[9px] uppercase font-bold px-1.5 py-0.2 bg-[rgb(var(--portal-subtle))] text-[rgb(var(--portal-primary))] border-[rgb(var(--portal-primary))]/30">Admin</span>
                    </div>
                    <p className="text-xs text-muted font-mono mt-0.5 truncate max-w-[160px]">{user?.name || 'Administrator'}</p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-xl bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Nav Items (Fully Scrollable Flex Area) */}
              <nav className="flex-1 min-h-0 p-3 space-y-1 overflow-y-auto overscroll-contain">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-medium text-sm",
                        isActive
                          ? "text-white font-semibold shadow-md"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="adminMobileSidebarActivePill"
                          className="absolute inset-0 pill-admin-active rounded-xl"
                          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                        />
                      )}
                      <Icon className="w-4 h-4 relative z-10 shrink-0" />
                      <span className="relative z-10 truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Drawer Footer (Fixed Bottom) */}
              <div className="p-4 border-t border-border bg-card/95 shrink-0 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSidebarOpen(false);
                    setLogoutOpen(true);
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 flex-1 rounded-xl text-destructive hover:bg-destructive/10 transition-colors font-medium text-sm cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
                <ThemeToggle />
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. DESKTOP FIXED SIDEBAR (lg+)                                            */}
      {/* ========================================================================= */}
      <aside
        className={cn(
          "hidden lg:flex fixed top-0 left-0 h-screen bg-card/80 backdrop-blur-xl border-r border-border shadow-xl z-30 flex-col justify-between overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex flex-col h-[calc(100vh-72px)]">
          {/* Logo */}
          <div className={cn("p-4 border-b border-border shrink-0 flex items-center justify-between", isCollapsed ? "px-3 justify-center flex-col gap-2" : "p-6")}>
            <Link href="/admin/dashboard" className="flex items-center gap-3 min-w-0" title="CureWell Admin Center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[rgb(var(--portal-admin-from))] to-[rgb(var(--portal-admin-to))] flex items-center justify-center shadow-lg text-white shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-heading truncate">HMS Admin</h1>
                  <p className="text-xs text-muted font-medium truncate">Operations Center</p>
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={toggleCollapse}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="flex-1 min-h-0 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onMouseEnter={() => item.api && preloadApi(item.api)}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl transition-all font-medium text-sm",
                    isCollapsed ? "px-0 py-2.5 justify-center" : "px-3.5 py-2.5",
                    isActive
                      ? "text-white font-semibold shadow-md"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="adminDesktopSidebarActivePill"
                      className="absolute inset-0 pill-admin-active rounded-xl"
                      transition={{ type: 'spring', stiffness: 500, damping: 32, mass: 0.6 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10 shrink-0" />
                  {!isCollapsed && <span className="relative z-10 truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Footer Controls */}
        <div className={cn("p-4 border-t border-border bg-card shrink-0 flex items-center gap-2", isCollapsed ? "flex-col p-2.5" : "justify-between")}>
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            title="Sign Out"
            className={cn(
              "flex items-center gap-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors font-medium text-sm cursor-pointer",
              isCollapsed ? "p-2.5 justify-center w-full" : "px-3 py-2 flex-1"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
          <ThemeToggle />
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 4. MAIN CONTENT WORKSPACE                                                 */}
      {/* ========================================================================= */}
      <main
        className={cn(
          "flex-1 w-full p-4 sm:p-6 lg:p-8 animate-fade-in transition-all duration-300 ease-in-out",
          isCollapsed
            ? "lg:ml-20 lg:w-[calc(100%-5rem)]"
            : "lg:ml-64 lg:w-[calc(100%-16rem)]"
        )}
      >
        <div className="w-full max-w-7xl mx-auto space-y-6">
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
