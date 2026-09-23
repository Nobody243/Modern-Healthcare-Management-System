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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SplineScene } from '@/components/ui/spline';
import { ThemeToggle } from '@/components/theme-toggle';
import { BorderBeam } from '@/components/ui/border-beam';

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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveNav(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 72;
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
        className="fixed top-0 left-0 right-0 h-[2.5px] card-accent-bar z-50 origin-left pointer-events-none transform-gpu will-change-transform shadow-sm"
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
      />

      {/* Background Subtle Ambient Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(var(--primary), 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--primary), 0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      {/* FIXED PERSISTENT TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-background/90 border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
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
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono">
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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 top-15 sm:top-16 bg-black/70 backdrop-blur-xs z-30"
              />

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden relative z-40 border-t border-border bg-card px-4 py-3 space-y-2 shadow-xl"
              >
                {[
                  { id: 'hero', label: 'Overview' },
                  { id: 'portals', label: 'Clinical Portals' },
                  { id: 'architecture', label: 'Architecture' },
                  { id: 'security', label: 'Security & HIPAA' },
                ].map((navItem) => (
                  <a
                    key={navItem.id}
                    href={`#${navItem.id}`}
                    onClick={(e) => {
                      scrollToSection(e, navItem.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      activeNav === navItem.id
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {navItem.label}
                  </a>
                ))}
                <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">ORACLE 19c ONLINE</span>
                  </div>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                    <Button className="btn-primary h-9 px-4 text-xs w-full justify-center rounded-xl">
                      Sign In →
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Stage */}
      <main className="relative z-10 pt-15 sm:pt-16">
        {/* ========================================================================= */}
        {/* SCENE 01: HERO SECTION                                                   */}
        {/* ========================================================================= */}
        <section
          id="hero"
          className="min-h-[auto] lg:min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8 sm:py-12 lg:py-4 scroll-mt-20"
        >
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* LEFT SIDE (50%): HEADLINE & ACTIONS */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-primary/40 shadow-xs text-xs font-semibold text-primary"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider">
                  ENTERPRISE HEALTHCARE PLATFORM
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-heading leading-[1.15]"
              >
                Unified Healthcare,{' '}
                <span className="text-gradient-medical inline-block">
                  Clinical EHR
                </span>{' '}
                & Hospital Care
              </motion.h1>

              {/* Sub-headline */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
                className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-lg leading-relaxed"
              >
                An integrated clinical workspace connecting physicians, patients, and hospital administrators
                with Oracle 19c database operations and HIPAA session security.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.24 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1"
              >
                <Link href="/login" className="w-full sm:w-auto">
                  <Button className="btn-primary h-10 sm:h-11 px-6 text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm">
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
                    className="btn-secondary h-10 sm:h-11 px-5 text-xs sm:text-sm rounded-xl w-full sm:w-auto justify-center"
                  >
                    Explore Portals ↓
                  </Button>
                </a>
              </motion.div>

              {/* Trust Rail Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground font-semibold"
              >
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-card border border-border shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-kpi-success shrink-0" />
                  <span className="truncate text-[11px] sm:text-xs">Oracle 19c ACID</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-card border border-border shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-kpi-success shrink-0" />
                  <span className="truncate text-[11px] sm:text-xs">HIPAA Privacy</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-card border border-border shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-kpi-success shrink-0" />
                  <span className="truncate text-[11px] sm:text-xs">15-Min Timeout</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-card border border-border shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-kpi-success shrink-0" />
                  <span className="truncate text-[11px] sm:text-xs">HttpOnly JWT</span>
                </div>
              </motion.div>
            </div>

            {/* RIGHT SIDE (50%): 3D SPLINE ROBOT (DESKTOP) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:flex lg:col-span-6 relative w-full h-[520px] items-center justify-center overflow-visible select-none isolate transform-gpu"
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

            {/* MOBILE & TABLET ONLY: CLEAN TELEMETRY CARD */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="block lg:hidden w-full"
            >
              <div className="p-4 rounded-2xl bg-card border border-border/90 shadow-md space-y-3 relative overflow-hidden">
                <div className="card-accent-bar absolute top-0 left-0 right-0" />
                
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-lg kpi-icon-success shadow-xs shrink-0">
                      <HeartPulse className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-heading truncate">Clinical Telemetry Engine</h3>
                      <p className="text-[10px] text-muted-foreground font-mono truncate">Live Biometric Stream • Oracle 19c</p>
                    </div>
                  </div>
                  <span className="badge badge-theme-success text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 shrink-0">
                    Online
                  </span>
                </div>

                {/* Mobile Vital Metrics Grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-background border border-border">
                    <span className="text-[9px] text-muted-foreground font-mono block">HEART RATE</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-base font-bold text-kpi-success font-mono">72</span>
                      <span className="text-[9px] text-muted-foreground font-mono">BPM</span>
                    </div>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-xl bg-background border border-border">
                    <span className="text-[9px] text-muted-foreground font-mono block">OXYGEN</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-base font-bold text-primary font-mono">98%</span>
                      <span className="text-[9px] text-muted-foreground font-mono">SpO2</span>
                    </div>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-xl bg-background border border-border">
                    <span className="text-[9px] text-muted-foreground font-mono block">SURGERY</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-base font-bold text-kpi-warning font-mono">1 Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SCENE 02: 3-TIER OPERATIONAL WORKSPACES                                   */}
        {/* ========================================================================= */}
        <section
          id="portals"
          className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2 mb-6 sm:mb-8"
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

          {/* Portal Selector Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mb-5 sm:mb-6 px-1"
          >
            <div className="p-1 bg-card border border-border rounded-2xl flex gap-1 shadow-xs max-w-full overflow-x-auto">
              {(['doctor', 'patient', 'admin'] as const).map((tab) => {
                const Icon = portalDetails[tab].icon;
                const isActive = activePortalTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActivePortalTab(tab)}
                    className={`relative flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
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
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="capitalize">{tab}</span>
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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-card border border-border/90 dark:border-slate-700/90 shadow-lg space-y-4 sm:space-y-5 relative overflow-hidden">
                <div className="card-accent-bar absolute top-0 left-0 right-0" />

                {/* Portal Card Header (Fluid wrap, no truncation) */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 pb-4 border-b border-border">
                  <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto min-w-0">
                    <div className={`p-2.5 sm:p-3 rounded-xl ${currentPortal.iconClass} shrink-0 shadow-xs mt-0.5 sm:mt-0`}>
                      <PortalIcon className="w-5 h-5 sm:w-6 h-6" />
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
                  <div className="space-y-2">
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

                  {/* Portal Telemetry Snapshot */}
                  <div className="p-3 sm:p-4 rounded-xl bg-background border border-border space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Portal Metrics
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {currentPortal.previewStats.map((stat, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-card border border-border">
                            <p className="text-[9px] text-muted-foreground font-mono">{stat.label}</p>
                            <p className="text-xs sm:text-sm font-bold text-primary mt-0.5 font-mono">
                              {stat.val}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pre-configured Demo Account */}
                    <div className="p-2 rounded-lg bg-card border border-border flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0">
                        <p className="text-[9px] text-muted-foreground uppercase font-mono">
                          Demo Account
                        </p>
                        <p className="font-mono text-primary font-bold text-xs truncate">
                          {currentPortal.demoEmail}
                        </p>
                      </div>
                      <button
                        onClick={() => copyDemoCreds(currentPortal.demoEmail)}
                        className="btn-secondary px-2.5 py-1 rounded-md text-[10px] font-mono flex items-center gap-1 cursor-pointer shrink-0"
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
          className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2 mb-6 sm:mb-8"
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <SpotlightCard className="p-4 sm:p-5 space-y-3 h-full flex flex-col justify-between rounded-2xl relative overflow-hidden">
                <BorderBeam size={160} duration={8} colorFrom="#1AA8BB" colorTo="#2DD4BF" />
                <div className="space-y-2 relative z-10">
                  <div className="p-2.5 w-fit rounded-xl kpi-icon-info shadow-xs">
                    <Database className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-heading">Oracle 19c Relational Core</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Unified 3NF relational schema with foreign key constraints, sequence generators, and ACID rollback safeguards.
                  </p>
                </div>
                <div className="pt-2.5 border-t border-border text-[11px] font-mono text-kpi-info font-bold relative z-10">
                  • 22 Relational DB Tables
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Bento Card 2: EHR & Vitals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.1 }}
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.15 }}
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.2 }}
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
          className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2 mb-6 sm:mb-8"
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.05 }}
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.1 }}
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.15 }}
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border"
        >
          <div className="p-5 sm:p-7 rounded-2xl bg-card border border-border/90 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 relative overflow-hidden">
            <div className="card-accent-bar absolute top-0 left-0 right-0" />

            <div className="space-y-1 text-center md:text-left">
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

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="btn-primary h-10 sm:h-11 px-6 text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto shadow-xs">
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
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-semibold text-foreground">CureWell Hospital Management System</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Oracle 19c</span>
            <span>Next.js 16</span>
            <span>HIPAA Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
