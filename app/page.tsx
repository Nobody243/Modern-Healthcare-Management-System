'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import {
  Stethoscope,
  Users,
  Activity,
  Database,
  Pill,
  Building2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  HeartPulse,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  Key,
  Menu,
  X,
  Crosshair,
  Compass,
  Layers,
  ChevronRight,
  LogIn,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SplineScene } from '@/components/ui/spline';
import { ThemeToggle } from '@/components/theme-toggle';

// ============================================================================
// ZERO-RERENDER DYNAMIC CURSOR GLOW (DESKTOP / FINE-POINTER ONLY)
// ============================================================================
function CursorGlow() {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const cursorX = useMotionValue(-500);
  const cursorY = useMotionValue(-500);
  const opacity = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 320, mass: 0.1 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Strictly verify fine pointer (mouse) and hover support (desktop only)
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
    setIsFinePointer(media.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    media.addEventListener('change', handleMediaChange);

    if (!media.matches) return () => media.removeEventListener('change', handleMediaChange);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      opacity.set(1);
    };

    const handleMouseLeave = () => {
      opacity.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      media.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, opacity]);

  if (!isFinePointer) return null;

  return (
    <div className="hidden lg:block pointer-events-none select-none">
      {/* Primary Luminous Ambient Beam Follower */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          opacity,
          background:
            'radial-gradient(circle, rgba(34, 211, 238, 0.16) 0%, rgba(59, 130, 246, 0.04) 45%, transparent 70%)',
        }}
        className="fixed top-0 left-0 z-30 w-[400px] h-[400px] rounded-full blur-2xl transform-gpu will-change-transform"
      />
      {/* Magnetic Core Micro Beacon */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          opacity,
          background:
            'radial-gradient(circle, rgba(34, 211, 238, 0.32) 0%, rgba(34, 211, 238, 0.06) 40%, transparent 70%)',
        }}
        className="fixed top-0 left-0 z-30 w-[120px] h-[120px] rounded-full blur-lg transform-gpu will-change-transform"
      />
    </div>
  );
}

// ============================================================================
// HIGH-VISIBILITY RESPONSIVE CARD
// ============================================================================
function SpotlightCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    // Only enable mouse hover listener on desktop devices with hover support
    setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !canHover) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, [canHover]);

  return (
    <div
      ref={cardRef}
      onMouseMove={canHover ? handleMouseMove : undefined}
      className={`group relative overflow-hidden rounded-2xl bg-card border border-border/90 dark:border-slate-700/90 shadow-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl lg:hover:-translate-y-1 transform-gpu will-change-transform ${className}`}
    >
      {/* Spotlight Beam (Desktop Only - completely disabled on mobile/tablet to avoid click blobs) */}
      {canHover && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform-gpu hidden lg:block"
          style={{
            background:
              'radial-gradient(320px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), rgba(34, 211, 238, 0.14), transparent 70%)',
          }}
        />
      )}
      {/* Top Accent Rim */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ============================================================================
// MAIN HOME PAGE COMPONENT
// ============================================================================
export default function HomePage() {
  const [activePortalTab, setActivePortalTab] = useState<'doctor' | 'patient' | 'admin'>('doctor');
  const [activeNav, setActiveNav] = useState<string>('hero');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop, { passive: true });
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    const sectionIds = ['hero', 'portals', 'architecture', 'security'];
    let rafId: number | null = null;

    const updateActiveSection = () => {
      const scrollPos = window.scrollY + 180;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveNav(sectionIds[i]);
          break;
        }
      }
      rafId = null;
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateActiveSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement> | null, id: string) => {
    if (e) e.preventDefault();
    setActiveNav(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const copyDemoCreds = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => {
      setCopiedEmail(null);
    }, 2000);
  };

  const portalDetails = {
    doctor: {
      title: 'Physician & Surgeon Portal',
      subtitle: 'Longitudinal EHR charting, vital telemetry & surgical schedules',
      badge: 'Physician Workflows',
      accentBg: 'badge-theme-success',
      iconClass: 'kpi-icon-success',
      icon: Stethoscope,
      demoEmail: 'demo.doctor@curewell.com',
      features: [
        'EHR patient charts with diagnosis records and allergy tracking',
        'Real-time vital telemetry (Heart rate, Blood Pressure, SpO2, Temp)',
        'Inpatient surgical scheduling with operating room coordination',
        'Electronic prescription authoring with instant pharmacy dispatch',
      ],
      previewStats: [
        { label: 'Assigned Patients', val: '24 Active' },
        { label: 'Today Surgeries', val: '1 In-Progress' },
        { label: 'Lab Reviews', val: '2 Awaiting' },
      ],
    },
    patient: {
      title: 'Patient Health Portal',
      subtitle: 'Self-service health charts, digital prescriptions & vital history',
      badge: 'Patient Self-Service',
      accentBg: 'badge-theme-info',
      iconClass: 'kpi-icon-info',
      icon: Users,
      demoEmail: 'demo.patient@curewell.com',
      features: [
        'Instant digital prescriptions with dosages, timing and refill alerts',
        'Historical vital telemetry tracker with graphical trend graphs',
        'Diagnostic laboratory test results & verified medical recommendations',
        'Surgical procedure timeline & post-op recovery notes',
      ],
      previewStats: [
        { label: 'Active Meds', val: '3 Current' },
        { label: 'Latest SpO2', val: '98% Optimal' },
        { label: 'Next Visit', val: 'Cardiology (Fri)' },
      ],
    },
    admin: {
      title: 'Hospital Operations Portal',
      subtitle: 'Pharmacy inventory, departmental payroll & infrastructure',
      badge: 'Hospital Operations',
      accentBg: 'badge-theme-primary',
      iconClass: 'kpi-icon-primary',
      icon: Building2,
      demoEmail: 'demo.admin@curewell.com',
      features: [
        'Staff payroll processing & automated salary disbursals',
        'Pharmacy stock control with batch LOT & expiration tracking',
        'Medical equipment asset tracking & preventive maintenance schedules',
        'Staff physician credentialing & Oracle DB audit logs',
      ],
      previewStats: [
        { label: 'Hospital Staff', val: '148 Active' },
        { label: 'Pharmacy SKUs', val: '2,400 In Stock' },
        { label: 'DB Latency', val: '14ms (ACID)' },
      ],
    },
  };

  const currentPortal = portalDetails[activePortalTab];
  const PortalIcon = currentPortal.icon;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground relative overflow-x-hidden">
      {/* Desktop Cursor Glow (Auto-hidden on Mobile / Tablet) */}
      <CursorGlow />

      {/* Top Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] card-accent-bar z-50 origin-left pointer-events-none transform-gpu will-change-transform shadow-xs"
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
      />

      {/* Background Subtle Ambient Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(var(--primary), 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--primary), 0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Soft Radial Ambient Glow for Mobile */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] sm:w-[600px] h-[300px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* FIXED PERSISTENT TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-background/90 border-b border-border shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl card-accent-bar flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform text-white shrink-0">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 font-extrabold stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-heading">
                  CureWell
                </span>
                <span className="badge badge-theme-primary text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5">
                  HMS
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium hidden sm:block">Healthcare Management</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-card/95 p-1 rounded-full border border-border shadow-xs text-xs font-bold text-muted-foreground">
            {[
              { id: 'hero', label: 'Overview' },
              { id: 'portals', label: 'Portals' },
              { id: 'architecture', label: 'Architecture' },
              { id: 'security', label: 'Security' },
            ].map((navItem) => {
              const isActive = activeNav === navItem.id;
              return (
                <a
                  key={navItem.id}
                  href={`#${navItem.id}`}
                  onClick={(e) => scrollToSection(e, navItem.id)}
                  className={`relative px-4 py-1.5 rounded-full transition-all cursor-pointer font-semibold ${
                    isActive ? 'text-white font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full shadow-xs"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{navItem.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
                ORACLE 19c <span className="text-emerald-600 dark:text-emerald-400">ONLINE</span>
              </span>
            </div>

            <ThemeToggle />

            <Link href="/login" className="hidden sm:inline-block">
              <Button className="btn-primary h-8 sm:h-9 px-3.5 sm:px-4 text-xs flex items-center gap-1.5 shadow-xs rounded-xl">
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer shadow-xs"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5 text-primary" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 top-14 bg-black/60 backdrop-blur-xs z-30"
              />

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden relative z-40 border-t border-border bg-card/95 backdrop-blur-xl px-4 py-4 space-y-3.5 shadow-2xl rounded-b-2xl"
              >
                {/* Section Navigation Links */}
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'hero', label: 'Overview', icon: Compass },
                    { id: 'portals', label: 'Workspaces', icon: Stethoscope },
                    { id: 'architecture', label: 'Architecture', icon: Layers },
                    { id: 'security', label: 'Security & HIPAA', icon: ShieldCheck },
                  ].map((navItem) => {
                    const NavIcon = navItem.icon;
                    const isActive = activeNav === navItem.id;
                    return (
                      <a
                        key={navItem.id}
                        href={`#${navItem.id}`}
                        onClick={(e) => {
                          scrollToSection(e, navItem.id);
                        }}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-primary/10 text-primary border border-primary/30 shadow-xs'
                            : 'text-foreground hover:bg-muted border border-transparent'
                        }`}
                      >
                        <NavIcon className="w-3.5 h-3.5 shrink-0 text-primary" />
                        <span className="truncate">{navItem.label}</span>
                      </a>
                    );
                  })}
                </div>

                {/* Quick 1-Tap Portal Logins on Mobile Drawer */}
                <div className="p-2.5 rounded-xl bg-muted/50 border border-border space-y-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground tracking-wider block">
                    Quick Portal Access
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg bg-card border border-border hover:border-kpi-success/50 transition-all text-center flex flex-col items-center gap-1 group"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-kpi-success group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold text-heading">Doctor</span>
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg bg-card border border-border hover:border-kpi-info/50 transition-all text-center flex flex-col items-center gap-1 group"
                    >
                      <Users className="w-3.5 h-3.5 text-kpi-info group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold text-heading">Patient</span>
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg bg-card border border-border hover:border-primary/50 transition-all text-center flex flex-col items-center gap-1 group"
                    >
                      <Building2 className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold text-heading">Admin</span>
                    </Link>
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-2 border-t border-border flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-700 dark:text-emerald-300 font-bold">ORACLE 19c LIVE</span>
                  </div>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                    <Button className="btn-primary h-9 px-4 text-xs w-full justify-center rounded-xl shadow-xs flex items-center gap-1.5">
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Stage */}
      <main className="relative z-10 pt-14 sm:pt-16">
        {/* ========================================================================= */}
        {/* SCENE 01: HERO SECTION                                                   */}
        {/* ========================================================================= */}
        <section
          id="hero"
          className="w-full lg:max-w-7xl lg:mx-auto min-h-[calc(100svh-3.5rem)] sm:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-2 lg:py-4 scroll-mt-16"
        >
          {/* ======================================================================= */}
          {/* DESKTOP HERO VIEW (LG & UP - UNCHANGED)                                 */}
          {/* ======================================================================= */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center w-full">
            {/* LEFT SIDE (50%): HEADLINE & ACTIONS */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left">
              {/* Live Status Pill */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-primary/40 shadow-xs text-xs font-semibold text-primary"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="font-mono text-[11px] uppercase tracking-wider font-bold">
                  ENTERPRISE HEALTHCARE PLATFORM
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.06 }}
                className="text-4xl lg:text-5xl font-extrabold tracking-tight text-heading leading-[1.16]"
              >
                Unified Healthcare,{' '}
                <span className="text-gradient-medical inline-block">
                  Clinical EHR
                </span>{' '}
                & Hospital Care
              </motion.h1>

              {/* Sub-headline */}
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 }}
                className="text-sm md:text-base text-muted-foreground max-w-lg leading-relaxed"
              >
                An integrated clinical workspace connecting physicians, patients, and hospital administrators
                with Oracle 19c database operations and HIPAA session security.
              </motion.p>

              {/* Action Buttons (Desktop Inline) */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="flex items-center gap-3 pt-1"
              >
                <Link href="/login">
                  <Button className="btn-primary h-11 px-6 text-sm rounded-xl flex items-center justify-center gap-2 shadow-md">
                    <Sparkles className="w-4 h-4" />
                    <span>Launch Live Demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a
                  href="#portals"
                  onClick={(e) => scrollToSection(e, 'portals')}
                >
                  <Button
                    variant="outline"
                    className="btn-secondary h-11 px-5 text-sm rounded-xl justify-center"
                  >
                    Explore Portals ↓
                  </Button>
                </a>
              </motion.div>

              {/* Trust Rail Badges (Desktop 4-Col Grid) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.28 }}
                className="pt-2 grid grid-cols-4 gap-2 text-xs text-muted-foreground font-semibold"
              >
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-card border border-border shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-kpi-success shrink-0" />
                  <span className="truncate text-xs">Oracle 19c ACID</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-card border border-border shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-kpi-success shrink-0" />
                  <span className="truncate text-xs">HIPAA Privacy</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-card border border-border shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-kpi-success shrink-0" />
                  <span className="truncate text-xs">15-Min Auto-Out</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-card border border-border shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-kpi-success shrink-0" />
                  <span className="truncate text-xs">HttpOnly JWT</span>
                </div>
              </motion.div>
            </div>

            {/* RIGHT SIDE (50%): 3D SPLINE ROBOT */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="col-span-6 relative w-full h-[520px] flex items-center justify-center overflow-visible select-none isolate transform-gpu"
            >
              <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />

              <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/90 border border-border font-mono text-[10px] text-primary backdrop-blur-xs shadow-xs">
                <Crosshair className="w-3.5 h-3.5 text-primary animate-spin" />
                <span>AI_DIAGNOSTIC: ACTIVE</span>
              </div>

              <div className="absolute bottom-4 right-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/90 border border-border font-mono text-[10px] text-kpi-success backdrop-blur-xs shadow-xs">
                <Activity className="w-3.5 h-3.5 text-kpi-success animate-pulse" />
                <span>SYSTEM: OPERATIONAL</span>
              </div>

              {isDesktop && (
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full pointer-events-auto relative z-10"
                />
              )}
            </motion.div>
          </div>

          {/* ======================================================================= */}
          {/* MOBILE & TABLET HERO VIEW (CONTENT-RICH, ZERO DEAD SPACE)                */}
          {/* ======================================================================= */}
          <div className="flex lg:hidden flex-col w-full space-y-4 py-3 sm:py-4">
            {/* Top Badge & Headline */}
            <div className="space-y-3 text-left">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-primary/40 shadow-2xs text-xs font-semibold text-primary"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider font-bold">
                  ORACLE 19c • HIPAA CERTIFIED
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight text-heading leading-[1.18]"
              >
                Unified Healthcare,{' '}
                <span className="text-gradient-medical inline-block">
                  Clinical EHR
                </span>{' '}
                & Hospital Care
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal"
              >
                An integrated clinical workspace connecting physicians, patients, and hospital administrators
                with Oracle 19c database operations and HIPAA session security.
              </motion.p>
            </div>

            {/* Rich Informative Feature Cards (Fills Space with Real Product Value) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="space-y-2 pt-0.5"
            >
              <div className="p-3 rounded-xl bg-card border border-border/80 shadow-2xs flex items-start gap-3">
                <div className="p-2 rounded-lg kpi-icon-success shrink-0 mt-0.5">
                  <Stethoscope className="w-4 h-4 text-kpi-success" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-heading">Physician & Clinical Charting</h3>
                  <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                    Longitudinal patient EHR, diagnosis records, and real-time vital telemetry.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border/80 shadow-2xs flex items-start gap-3">
                <div className="p-2 rounded-lg kpi-icon-info shrink-0 mt-0.5">
                  <Users className="w-4 h-4 text-kpi-info" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-heading">Patient Self-Service Portal</h3>
                  <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                    Instant digital prescriptions, lab test results, and care team appointments.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-card border border-border/80 shadow-2xs flex items-start gap-3">
                <div className="p-2 rounded-lg kpi-icon-primary shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-heading">Hospital Operations & Pharmacy</h3>
                  <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                    Automated medication dispensing, ward bed tracking, and payroll processing.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-2.5 w-full pt-1"
            >
              <Link href="/login" className="w-full sm:flex-1">
                <Button className="btn-primary h-12 w-full text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md">
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Live Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a
                href="#portals"
                onClick={(e) => scrollToSection(e, 'portals')}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  className="btn-secondary h-12 w-full sm:w-auto px-5 text-xs sm:text-sm font-semibold rounded-xl justify-center"
                >
                  Explore Portals ↓
                </Button>
              </a>
            </motion.div>

            {/* Trust Badges / Tags 2x2 Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="grid grid-cols-2 gap-2 text-xs text-muted-foreground font-semibold"
            >
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-card border border-border shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-kpi-success shrink-0" />
                <span className="truncate text-xs">Oracle 19c ACID</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-card border border-border shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-kpi-success shrink-0" />
                <span className="truncate text-xs">HIPAA Privacy</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-card border border-border shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-kpi-success shrink-0" />
                <span className="truncate text-xs">15-Min Auto-Out</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-card border border-border shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-kpi-success shrink-0" />
                <span className="truncate text-xs">HttpOnly JWT</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SCENE 02: 3-TIER OPERATIONAL WORKSPACES                                   */}
        {/* ========================================================================= */}
        <section
          id="portals"
          className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border scroll-mt-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-2 mb-5 sm:mb-8"
          >
            <span className="badge badge-theme-primary text-xs font-mono font-bold uppercase tracking-wider px-3 py-1">
              CLINICAL WORKSPACES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading">
              Three Dedicated Environments
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Purpose-built workflows and role-based security boundaries for every hospital stakeholder.
            </p>
          </motion.div>

          {/* Segmented Portal Selector Tabs (Clean 3-Col Grid on Mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="flex justify-center mb-5 sm:mb-6"
          >
            <div className="grid grid-cols-3 w-full max-w-md p-1 bg-card border border-border rounded-2xl shadow-xs gap-1">
              {(['doctor', 'patient', 'admin'] as const).map((tab) => {
                const Icon = portalDetails[tab].icon;
                const isActive = activePortalTab === tab;
                const tabLabel = tab === 'doctor' ? 'Doctor' : tab === 'patient' ? 'Patient' : 'Admin';
                return (
                  <button
                    key={tab}
                    onClick={() => setActivePortalTab(tab)}
                    className={`relative flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'text-white font-extrabold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePortalTabPill"
                        className="absolute inset-0 btn-primary rounded-xl shadow-xs"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-1.5 truncate">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{tabLabel}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Active Portal Showcase Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePortalTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-card border border-border/90 dark:border-slate-700/90 shadow-lg space-y-4 sm:space-y-5 relative overflow-hidden">
                <div className="card-accent-bar absolute top-0 left-0 right-0" />

                {/* Portal Card Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 pb-4 border-b border-border">
                  <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto min-w-0">
                    <div className={`p-2.5 sm:p-3 rounded-xl ${currentPortal.iconClass} shrink-0 shadow-xs mt-0.5 sm:mt-0`}>
                      <PortalIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={`badge ${currentPortal.accentBg} text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 inline-block mb-1`}>
                        {currentPortal.badge}
                      </span>
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-heading leading-snug break-words">
                        {currentPortal.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-normal">
                        {currentPortal.subtitle}
                      </p>
                    </div>
                  </div>

                  <Link href="/login" className="w-full sm:w-auto shrink-0 mt-1 sm:mt-0">
                    <Button className="btn-primary h-9 px-4 text-xs rounded-xl flex items-center justify-center gap-1.5 w-full sm:w-auto shadow-xs">
                      <span>Launch Demo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {/* Capabilities List */}
                  <div className="space-y-2.5">
                    <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Core Capabilities
                    </h4>
                    <ul className="space-y-2">
                      {currentPortal.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Portal Telemetry Snapshot & Credentials */}
                  <div className="p-3.5 sm:p-4 rounded-xl bg-background border border-border space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Portal Metrics
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {currentPortal.previewStats.map((stat, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-card border border-border shadow-2xs">
                            <p className="text-[9px] text-muted-foreground font-mono truncate">{stat.label}</p>
                            <p className="text-xs sm:text-sm font-bold text-primary mt-0.5 font-mono truncate">
                              {stat.val}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pre-configured Demo Account Box with One-Click Copy */}
                    <div className="p-2.5 rounded-lg bg-card border border-border flex items-center justify-between gap-2 text-xs shadow-2xs">
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] text-muted-foreground uppercase font-mono font-bold">
                          Pre-Configured Demo Account
                        </p>
                        <p className="font-mono text-primary font-bold text-xs truncate mt-0.5">
                          {currentPortal.demoEmail}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => copyDemoCreds(currentPortal.demoEmail)}
                          className="btn-secondary px-2.5 py-1 rounded-md text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                        >
                          {copiedEmail === currentPortal.demoEmail ? (
                            <>
                              <Check className="w-3 h-3 text-kpi-success" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                        <Link href="/login">
                          <Button className="btn-primary h-7 px-2.5 text-[10px] rounded-md font-mono flex items-center gap-1">
                            <span>Sign In</span>
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ========================================================================= */}
        {/* SCENE 03: TECHNICAL ARCHITECTURE BENTO GRID                               */}
        {/* ========================================================================= */}
        <section
          id="architecture"
          className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border scroll-mt-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-2 mb-5 sm:mb-8"
          >
            <span className="badge badge-theme-primary text-xs font-mono font-bold uppercase tracking-wider px-3 py-1">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading">
              Enterprise Resilience & Clinical Precision
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              ACID-compliant Oracle 19c relational schema with multi-tier healthcare safety protocols.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {/* Bento Card 1: Oracle Database */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <SpotlightCard className="p-4 sm:p-5 space-y-3 h-full flex flex-col justify-between rounded-2xl">
                <div className="space-y-2">
                  <div className="p-2.5 w-fit rounded-xl kpi-icon-info shadow-xs">
                    <Database className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-heading">Oracle 19c Relational Core</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Unified 3NF relational schema with foreign key constraints, sequence generators, and ACID rollback safeguards.
                  </p>
                </div>
                <div className="pt-2.5 border-t border-border text-[11px] font-mono text-kpi-info font-bold">
                  • 22 Relational DB Tables
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Bento Card 2: EHR & Vitals */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              <SpotlightCard className="p-4 sm:p-5 space-y-3 h-full flex flex-col justify-between rounded-2xl">
                <div className="space-y-2">
                  <div className="p-2.5 w-fit rounded-xl kpi-icon-danger shadow-xs">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-heading">Clinical EHR & Vitals</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Longitudinal medical charts tracking 5 vital parameters alongside allergy records and diagnostic lab orders.
                  </p>
                </div>
                <div className="pt-2.5 border-t border-border text-[11px] font-mono text-kpi-danger font-bold">
                  • 5 Biometric Parameters
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Bento Card 3: Pharmacy & Asset Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.35, delay: 0.15 }}
            >
              <SpotlightCard className="p-4 sm:p-5 space-y-3 h-full flex flex-col justify-between rounded-2xl">
                <div className="space-y-2">
                  <div className="p-2.5 w-fit rounded-xl kpi-icon-success shadow-xs">
                    <Pill className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-heading">Pharmacy & Inventory</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Batch LOT tracking, automated expiration audits, supplier procurement, and prescription dispensing.
                  </p>
                </div>
                <div className="pt-2.5 border-t border-border text-[11px] font-mono text-kpi-success font-bold">
                  • Zero Stock-Out Safeguards
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Bento Card 4: Operations & Payroll */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              <SpotlightCard className="p-4 sm:p-5 space-y-3 h-full flex flex-col justify-between rounded-2xl">
                <div className="space-y-2">
                  <div className="p-2.5 w-fit rounded-xl kpi-icon-primary shadow-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-heading">Operations & Payroll</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Departmental staff payroll disbursal, OR surgical scheduling, medical asset lifecycle, and audit logs.
                  </p>
                </div>
                <div className="pt-2.5 border-t border-border text-[11px] font-mono text-kpi-primary font-bold">
                  • Enterprise Administration
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SCENE 04: HIPAA SECURITY & SESSION GOVERNANCE                             */}
        {/* ========================================================================= */}
        <section
          id="security"
          className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border scroll-mt-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4 }}
            className="text-center space-y-2 mb-5 sm:mb-8"
          >
            <span className="badge badge-theme-primary text-xs font-mono font-bold uppercase tracking-wider px-3 py-1">
              SECURITY & GOVERNANCE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading">
              HIPAA Session Security & Zero-Trust
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Multi-layered defenses safeguarding patient records and enforcing strict access control.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <SpotlightCard className="p-4 sm:p-5 space-y-3 h-full flex flex-col justify-between rounded-2xl">
                <div className="space-y-2">
                  <div className="p-2.5 w-fit rounded-xl kpi-icon-warning shadow-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-heading">15-Minute Auto-Logout</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Automatic activity monitoring invalidates idle sessions after 15 minutes, protecting clinical terminals in busy hospital wards.
                  </p>
                </div>
                <div className="pt-2.5 border-t border-border text-[11px] font-mono text-kpi-warning font-bold">
                  • Inactivity Protection
                </div>
              </SpotlightCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              <SpotlightCard className="p-4 sm:p-5 space-y-3 h-full flex flex-col justify-between rounded-2xl">
                <div className="space-y-2">
                  <div className="p-2.5 w-fit rounded-xl kpi-icon-success shadow-xs">
                    <Key className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-heading">HttpOnly Session Cookies</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Cryptographic JWT session tokens stored exclusively in HttpOnly cookies, neutralizing XSS credential theft.
                  </p>
                </div>
                <div className="pt-2.5 border-t border-border text-[11px] font-mono text-kpi-success font-bold">
                  • XSS & Injection Guard
                </div>
              </SpotlightCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="sm:col-span-2 lg:col-span-1"
            >
              <SpotlightCard className="p-4 sm:p-5 space-y-3 h-full flex flex-col justify-between rounded-2xl">
                <div className="space-y-2">
                  <div className="p-2.5 w-fit rounded-xl kpi-icon-info shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-heading">Role-Based Access (RBAC)</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Edge middleware verifies token claims to ensure doctors, patients, and admins only access authorized datasets.
                  </p>
                </div>
                <div className="pt-2.5 border-t border-border text-[11px] font-mono text-kpi-info font-bold">
                  • Zero-Trust Isolation
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SCENE 05: CALL TO ACTION BANNER                                           */}
        {/* ========================================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.4 }}
          className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border"
        >
          <div className="p-5 sm:p-7 rounded-2xl bg-card border border-border/90 dark:border-slate-700/90 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 relative overflow-hidden">
            <div className="card-accent-bar absolute top-0 left-0 right-0" />

            <div className="space-y-1 text-center md:text-left w-full md:w-auto">
              <span className="text-[10px] font-mono text-primary uppercase tracking-widest font-bold">
                SYSTEM ACCESS
              </span>
              <h3 className="text-lg sm:text-2xl font-bold text-heading">
                Ready to Experience CureWell HMS?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-lg">
                Explore pre-seeded clinical records for Doctor, Patient, and Admin portals with instant one-click demo access.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto shrink-0">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="btn-primary h-10 sm:h-11 px-6 text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto shadow-md">
                  <span>Sign In to System</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Modern Technical Footer */}
      <footer className="border-t border-border bg-card/40 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground text-center sm:text-left">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-semibold text-foreground">CureWell Hospital Management System</span>
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-4 font-mono text-[11px] flex-wrap">
            <span>Oracle 19c</span>
            <span>Next.js 16</span>
            <span>HIPAA Compliant</span>
            <span>ACID Safe</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
