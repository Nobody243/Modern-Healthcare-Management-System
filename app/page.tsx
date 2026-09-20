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
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Server,
  HeartPulse,
  Sliders,
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
// ZERO-RERENDER DYNAMIC CURSOR GLOW (GPU HARDWARE ACCELERATED)
// ============================================================================
function CursorGlow() {
  const cursorX = useMotionValue(-500);
  const cursorY = useMotionValue(-500);
  const opacity = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 320, mass: 0.1 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
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
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, opacity]);

  return (
    <>
      {/* 1. Primary Luminous Ambient Beam Follower */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          opacity,
          background:
            'radial-gradient(circle, rgba(34, 211, 238, 0.22) 0%, rgba(59, 130, 246, 0.08) 45%, transparent 70%)',
        }}
        className="pointer-events-none fixed top-0 left-0 z-30 w-[480px] h-[480px] rounded-full blur-2xl transform-gpu will-change-transform"
      />
      {/* 2. Magnetic Core Micro Beacon */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          opacity,
          background:
            'radial-gradient(circle, rgba(34, 211, 238, 0.45) 0%, rgba(34, 211, 238, 0.12) 40%, transparent 70%)',
        }}
        className="pointer-events-none fixed top-0 left-0 z-30 w-[160px] h-[160px] rounded-full blur-lg transform-gpu will-change-transform"
      />
    </>
  );
}

// ============================================================================
// ZERO-RERENDER SPOTLIGHT CARD (CSS VARIABLE COMPOSITOR ACCELERATION)
// ============================================================================
function SpotlightCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-2xl bg-card/70 border border-border backdrop-blur-md transition-all duration-300 hover:border-border/90 hover:shadow-xl hover:-translate-y-0.5 transform-gpu will-change-transform ${className}`}
    >
      {/* Studio Keylight Spotlight Beam (Compositor Level) */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform-gpu"
        style={{
          background:
            'radial-gradient(450px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), rgba(34, 211, 238, 0.2), transparent 70%)',
        }}
      />
      {/* Subtle Metallic Top Bevel */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
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

  // Direct 1:1 scroll progress without laggy spring
  const { scrollYProgress } = useScroll();

  // High-performance rAF-throttled scroll spy for instant, jitter-free active nav pill tracking
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
    updateActiveSection(); // Initialize on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Smooth scroll handler with persistent fixed header offset compensation
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
      title: 'Clinical Physician & Surgeon Portal',
      subtitle: 'Comprehensive diagnostic workspace, vital telemetry charting & surgical management',
      badge: 'Physician Workflows',
      accentBg: 'badge-theme-success',
      iconClass: 'kpi-icon-success',
      icon: Stethoscope,
      demoEmail: 'demo.doctor@curewell.com',
      features: [
        'EHR Patient Charting (Allergies, Medical Histories & Multi-Parametric Diagnoses)',
        'Real-Time Vital Sign Recording (Heart Pulse, Blood Pressure, SpO2, Temp, Respiration)',
        'Inpatient & Outpatient Surgical Scheduling (OR Assignments & Pre-Op Protocols)',
        'Electronic Prescription Formulation & Instant Pharmacy Dispatch Pipeline',
        'Laboratory Diagnostic Test Requisitions (CMP, CBC, Cardiac Biomarker Panels)',
      ],
      previewStats: [
        { label: 'Assigned Patients', val: '24 Active' },
        { label: 'Today Surgeries', val: '1 In-Progress' },
        { label: 'Pending Lab Reviews', val: '2 Awaiting' },
      ],
    },
    patient: {
      title: 'Patient Personal Health Portal',
      subtitle: 'Self-service medical records, prescription instructions & vital biometric tracker',
      badge: 'Patient Self-Service',
      accentBg: 'badge-theme-info',
      iconClass: 'kpi-icon-info',
      icon: Users,
      demoEmail: 'demo.patient@curewell.com',
      features: [
        'Instant Access to Digital Prescriptions (Dosages, Frequency, Timing & Refills)',
        'Continuous Biometric Health Vitals Tracker with Historical Graphical Trends',
        'Laboratory Diagnostic Reports & Verified Physician Recommendations',
        'Surgical History & Post-Operative Rehabilitation Tracking',
        'Profile Security, Emergency Contacts & Real-Time Notification Settings',
      ],
      previewStats: [
        { label: 'Active Prescriptions', val: '3 Current' },
        { label: 'Latest SpO2', val: '98% Optimal' },
        { label: 'Next Appointment', val: 'Cardiology (Fri)' },
      ],
    },
    admin: {
      title: 'Enterprise Hospital Operations Portal',
      subtitle: 'Hospital-wide infrastructure, pharmacy inventory control & payroll disbursal',
      badge: 'Hospital Operations',
      accentBg: 'badge-theme-primary',
      iconClass: 'kpi-icon-primary',
      icon: Building2,
      demoEmail: 'demo.admin@curewell.com',
      features: [
        'Departmental Payroll Management & Direct Salary Disbursal Processing',
        'Pharmacy Stock Control (Batch Lot Tracking, Expiry Audits & Re-order Levels)',
        'Hospital Equipment Asset Lifecycle & Preventive Maintenance Scheduling',
        'Doctor & Patient Credentialing, Licensing & Department Floor Assignments',
        'Audit Trail Monitoring, Oracle Database Telemetry & Zero-Trust Session Control',
      ],
      previewStats: [
        { label: 'Hospital Staff', val: '148 Active' },
        { label: 'Pharmacy SKUs', val: '2,400 In Stock' },
        { label: 'Oracle DB Latency', val: '14ms (ACID)' },
      ],
    },
  };

  const currentPortal = portalDetails[activePortalTab];
  const PortalIcon = currentPortal.icon;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground relative overflow-x-hidden">
      {/* Interactive GPU Cursor Glow Beam */}
      <CursorGlow />

      {/* Top 1:1 Instant Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] card-accent-bar z-50 origin-left pointer-events-none transform-gpu will-change-transform shadow-md"
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
      />

      {/* Background Architectural Grid & Subtle Ambient Glow */}
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
        <div className="absolute top-[60%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      </div>

      {/* FIXED PERSISTENT TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-background/85 border-b border-border shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl card-accent-bar flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform text-white">
              <Activity className="w-5 h-5 font-extrabold stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-heading">
                  CureWell
                </span>
                <span className="badge badge-theme-primary text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5">
                  HMS
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium">Enterprise Healthcare System</p>
            </div>
          </Link>

          {/* Desktop Smooth Scroll Navigation Links with Spring Pill */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-card/95 p-1.5 rounded-full border border-border shadow-md text-xs font-bold text-muted-foreground">
            {[
              { id: 'hero', label: 'Overview' },
              { id: 'portals', label: 'Clinical Portals' },
              { id: 'architecture', label: 'Architecture' },
              { id: 'security', label: 'HIPAA & Security' },
            ].map((navItem) => {
              const isActive = activeNav === navItem.id;
              return (
                <a
                  key={navItem.id}
                  href={`#${navItem.id}`}
                  onClick={(e) => scrollToSection(e, navItem.id)}
                  className={`relative px-4 py-1.5 rounded-full transition-all cursor-pointer font-bold ${
                    isActive ? 'text-white font-black' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full shadow-md shadow-cyan-500/30 border border-cyan-300/40"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{navItem.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action & System Status */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-xs font-mono shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-400" />
              <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold">
                ORACLE 19c: <span className="text-emerald-600 dark:text-emerald-400 font-black">ONLINE</span>
              </span>
            </div>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />

            <Link href="/login" className="hidden sm:inline-block">
              <Button className="btn-primary h-9 px-4 text-xs flex items-center gap-1.5 shadow-md">
                <span>Access Portals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            {/* Mobile / Tablet Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-card border border-border text-foreground hover:bg-muted transition-colors cursor-pointer flex items-center justify-center active:scale-95 shadow-sm"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Tap Outside Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden fixed inset-0 top-16 bg-black/80 backdrop-blur-md z-30"
              />

              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden relative z-40 border-t border-border bg-card px-4 py-4 space-y-2.5 shadow-2xl max-h-[calc(100vh-4.5rem)] overflow-y-auto"
              >
                {[
                  { id: 'hero', label: 'Overview' },
                  { id: 'portals', label: 'Clinical Portals' },
                  { id: 'architecture', label: 'Architecture' },
                  { id: 'security', label: 'HIPAA & Security' },
                ].map((navItem) => (
                  <a
                    key={navItem.id}
                    href={`#${navItem.id}`}
                    onClick={(e) => {
                      scrollToSection(e, navItem.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeNav === navItem.id
                        ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-primary border border-primary/40 shadow-sm'
                        : 'text-foreground hover:bg-muted/70'
                    }`}
                  >
                    {navItem.label}
                  </a>
                ))}
                <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center justify-between gap-3 px-1 py-1">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold">ORACLE 19c ONLINE</span>
                    </div>
                    <ThemeToggle />
                  </div>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full sm:w-auto">
                    <Button className="btn-primary h-10 px-5 text-xs w-full justify-center">
                      Access Live Portals →
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Stage */}
      <main className="relative z-10 pt-16">
        {/* ========================================================================= */}
        {/* SCENE 01: HERO SECTION                                                   */}
        {/* ========================================================================= */}
        <section
          id="hero"
          className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-10 lg:py-6 scroll-mt-20"
        >
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* LEFT SIDE (50%): HEADLINE & ACTIONS */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Filmic Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-card/90 border border-primary/40 shadow-sm text-xs font-semibold text-primary"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="font-mono text-[11px] uppercase tracking-wider">
                  ENTERPRISE CLINICAL HEALTHCARE PLATFORM
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-heading leading-[1.12]"
              >
                Unified Hospital Operations,{' '}
                <span className="text-gradient-medical inline-block">
                  Clinical EHR
                </span>{' '}
                & Patient Care
              </motion.h1>

              {/* Sub-headline */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
              >
                An integrated platform engineered for hospital administration, clinical physicians,
                and patients. Powered by Oracle enterprise transactions, EHR records, and strict HIPAA
                session security.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 w-full sm:w-auto"
              >
                <Link href="/login" className="w-full sm:w-auto">
                  <Button className="btn-primary h-12 px-7 text-sm rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto">
                    <Sparkles className="w-4 h-4" />
                    <span>Launch Live Portals</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <a
                  href="#portals"
                  onClick={(e) => scrollToSection(e, 'portals')}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    className="btn-secondary h-12 px-6 text-sm rounded-xl w-full sm:w-auto justify-center"
                  >
                    Explore Clinical Portals ↓
                  </Button>
                </a>
              </motion.div>

              {/* Trust Rail */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs text-muted-foreground font-medium max-w-lg"
              >
                <div className="flex items-center gap-2 p-2 rounded-lg bg-card/60 border border-border">
                  <CheckCircle2 className="w-4 h-4 text-kpi-success shrink-0" />
                  <span>Oracle 19c Enterprise DB</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-card/60 border border-border">
                  <CheckCircle2 className="w-4 h-4 text-kpi-success shrink-0" />
                  <span>HIPAA Grade Privacy</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-card/60 border border-border">
                  <CheckCircle2 className="w-4 h-4 text-kpi-success shrink-0" />
                  <span>15-Min Inactivity Timeout</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-card/60 border border-border">
                  <CheckCircle2 className="w-4 h-4 text-kpi-success shrink-0" />
                  <span>HttpOnly Session Tokens</span>
                </div>
              </motion.div>
            </div>

            {/* RIGHT SIDE (50%): DESKTOP ONLY 3D SPLINE ROBOT */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:flex lg:col-span-6 relative w-full h-[620px] items-center justify-center overflow-visible select-none isolate transform-gpu"
            >
              {/* Anamorphic Horizon Line Flare */}
              <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none" />

              {/* Floating HUD Reticles */}
              <div className="absolute top-6 left-6 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/80 border border-border font-mono text-[10px] text-primary backdrop-blur-sm shadow-md">
                <Crosshair className="w-3.5 h-3.5 text-primary animate-spin" />
                <span>AI_DIAGNOSTIC_ASSIST: ACTIVE</span>
              </div>

              <div className="absolute bottom-6 right-6 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/80 border border-border font-mono text-[10px] text-kpi-success backdrop-blur-sm shadow-md">
                <Activity className="w-3.5 h-3.5 text-kpi-success animate-pulse" />
                <span>SYSTEM STATUS: OPERATIONAL</span>
              </div>

              {/* Full 3D Interactive Spline Robot (Desktop Only) */}
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full pointer-events-auto relative z-10"
              />
            </motion.div>

            {/* MOBILE & TABLET ONLY: SLEEK INTERACTIVE CLINICAL TELEMETRY HUD */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="block lg:hidden w-full mt-2"
            >
              <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-2xl space-y-4 relative overflow-hidden backdrop-blur-xl">
                <div className="card-accent-bar absolute top-0 left-0 right-0" />
                
                {/* HUD Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl kpi-icon-success shadow-sm">
                      <HeartPulse className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-heading">Clinical Telemetry Engine</h3>
                      <p className="text-[11px] text-muted-foreground font-mono">Live Biometric Stream • Oracle 19c</p>
                    </div>
                  </div>
                  <span className="badge badge-theme-success text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                    Online
                  </span>
                </div>

                {/* Mobile Vital Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-background/80 border border-border space-y-1">
                    <span className="text-[10px] text-muted-foreground font-mono block">HEART RATE</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-kpi-success font-mono">72</span>
                      <span className="text-[10px] text-muted-foreground font-mono">BPM</span>
                    </div>
                    <span className="text-[9px] text-kpi-success font-semibold block">Normal Sinus</span>
                  </div>

                  <div className="p-3 rounded-xl bg-background/80 border border-border space-y-1">
                    <span className="text-[10px] text-muted-foreground font-mono block">OXYGEN SpO2</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-primary font-mono">98%</span>
                      <span className="text-[10px] text-muted-foreground font-mono">Sat</span>
                    </div>
                    <span className="text-[9px] text-kpi-primary font-semibold block">Optimal Range</span>
                  </div>

                  <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-background/80 border border-border space-y-1">
                    <span className="text-[10px] text-muted-foreground font-mono block">OR SCHEDULE</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-kpi-warning font-mono">1 Active</span>
                    </div>
                    <span className="text-[9px] text-kpi-warning font-semibold block">Pre-Op Ready</span>
                  </div>
                </div>

                {/* Quick Portal Switcher Banner */}
                <div className="pt-2 flex items-center justify-between text-xs border-t border-border/80">
                  <span className="text-[11px] text-muted-foreground font-medium">3 Dedicated Portals:</span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded-md bg-[rgb(var(--portal-doctor-from))]/15 text-[rgb(var(--portal-doctor-text))] border border-[rgb(var(--portal-doctor-from))]/30 font-bold">Doctor</span>
                    <span className="px-2 py-0.5 rounded-md bg-[rgb(var(--portal-patient-from))]/15 text-[rgb(var(--portal-patient-text))] border border-[rgb(var(--portal-patient-from))]/30 font-bold">Patient</span>
                    <span className="px-2 py-0.5 rounded-md bg-[rgb(var(--portal-admin-from))]/15 text-[rgb(var(--portal-admin-text))] border border-[rgb(var(--portal-admin-from))]/30 font-bold">Admin</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SCENE 02: 3-TIER OPERATIONAL WORKSPACES (DOCTOR / PATIENT / ADMIN)        */}
        {/* ========================================================================= */}
        <section
          id="portals"
          className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 mb-8 sm:mb-12"
          >
            <span className="badge badge-theme-primary text-xs font-mono font-bold uppercase tracking-wider px-3 py-1">
              ROLE-BASED CLINICAL WORKSPACES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading">
              Three Dedicated Environments. One Hospital System.
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Engineered with distinct security boundaries and purpose-built clinical workflows for
              every healthcare stakeholder.
            </p>
          </motion.div>

          {/* Portal Selector Tabs with Morphing Spring Pill Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex justify-center mb-6 sm:mb-8 px-2"
          >
            <div className="p-1.5 bg-card/90 border border-border rounded-2xl flex flex-wrap sm:flex-nowrap justify-center gap-1.5 relative max-w-full shadow-lg">
              {(['doctor', 'patient', 'admin'] as const).map((tab) => {
                const Icon = portalDetails[tab].icon;
                const isActive = activePortalTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActivePortalTab(tab)}
                    className={`relative flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex-1 sm:flex-initial min-w-[95px] ${
                      isActive
                        ? 'text-primary-foreground font-extrabold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePortalTabPill"
                        className="absolute inset-0 btn-primary rounded-xl shadow-md"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="capitalize">{tab} <span className="hidden sm:inline">Portal</span></span>
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
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl mx-auto"
            >
              <div className="p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-card border border-border shadow-2xl space-y-6 sm:space-y-8 relative overflow-hidden">
                <div className="card-accent-bar absolute top-0 left-0 right-0" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-border">
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${currentPortal.iconClass} shrink-0 shadow-md`}>
                      <PortalIcon className="w-6 h-6 sm:w-8 h-8" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`badge ${currentPortal.accentBg} text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5`}
                        >
                          {currentPortal.badge}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-2xl font-bold text-heading mt-1 truncate">{currentPortal.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 sm:line-clamp-1">{currentPortal.subtitle}</p>
                    </div>
                  </div>

                  <Link href="/login" className="w-full sm:w-auto shrink-0">
                    <Button className="btn-primary h-10 sm:h-11 px-5 sm:px-6 text-xs rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto shadow-md">
                      <span>Launch Portal Demo</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {/* Capabilities List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      Core Functional Capabilities
                    </h4>
                    <ul className="space-y-2.5">
                      {currentPortal.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-foreground/90 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Portal Telemetry Snapshot */}
                  <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-background border border-border space-y-4 sm:space-y-5 flex flex-col justify-between shadow-inner">
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-3">
                        Operational Status Snapshot
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        {currentPortal.previewStats.map((stat, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-card border border-border"
                          >
                            <p className="text-[10px] text-muted-foreground font-mono">{stat.label}</p>
                            <p className="text-sm font-bold text-primary mt-1 font-mono">
                              {stat.val}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pre-configured Demo Account with One-Click Copy */}
                    <div className="p-3 sm:p-3.5 rounded-xl bg-card border border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-0 text-xs">
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground uppercase font-mono">
                          Pre-configured Demo Account
                        </p>
                        <p className="font-mono text-primary font-bold text-xs sm:text-sm mt-0.5 truncate">
                          {currentPortal.demoEmail}
                        </p>
                      </div>
                      <button
                        onClick={() => copyDemoCreds(currentPortal.demoEmail)}
                        className="btn-secondary px-3 py-1.5 rounded-lg text-[11px] font-mono flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                      >
                        {copiedEmail === currentPortal.demoEmail ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-kpi-success" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Credentials</span>
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
          className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 mb-10 sm:mb-14"
          >
            <span className="badge badge-theme-primary text-xs font-mono font-bold uppercase tracking-wider px-3 py-1">
              ENTERPRISE ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading">
              Enterprise Resilience & Clinical Precision
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Engineered with full ACID compliance on Oracle 19c and multi-layered clinical safety
              protocols.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Bento Card 1: Oracle Database */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <SpotlightCard className="p-5 sm:p-6 space-y-3.5 sm:space-y-4 h-full flex flex-col justify-between rounded-2xl relative overflow-hidden">
                <BorderBeam size={180} duration={8} colorFrom="#1AA8BB" colorTo="#2DD4BF" />
                <div className="space-y-3.5 relative z-10">
                  <div className="p-3 w-fit rounded-xl kpi-icon-info shadow-md">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-heading">Oracle 19c Relational Core</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Full relational integrity with foreign keys, check constraints, sequences, and ACID
                    transaction rollback safeguards.
                  </p>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-border text-[11px] sm:text-xs font-mono text-kpi-info font-bold relative z-10">
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
              <SpotlightCard className="p-5 sm:p-6 space-y-3.5 sm:space-y-4 h-full flex flex-col justify-between rounded-2xl">
                <div className="space-y-3.5">
                  <div className="p-3 w-fit rounded-xl kpi-icon-danger shadow-md">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-heading">Clinical EHR & Vitals</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Tracks pulse, blood pressure, respiration, body temp, and SpO2 alongside allergy records
                    and diagnostic requisitions.
                  </p>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-border text-[11px] sm:text-xs font-mono text-kpi-danger font-bold">
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
              <SpotlightCard className="p-5 sm:p-6 space-y-3.5 sm:space-y-4 h-full flex flex-col justify-between rounded-2xl">
                <div className="space-y-3.5">
                  <div className="p-3 w-fit rounded-xl kpi-icon-success shadow-md">
                    <Pill className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-heading">Pharmacy & Inventory</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Tracks batch LOTs, expiration dates, stock depletion alerts, supplier procurement, and
                    prescription dispensing.
                  </p>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-border text-[11px] sm:text-xs font-mono text-kpi-success font-bold">
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
              <SpotlightCard className="p-5 sm:p-6 space-y-3.5 sm:space-y-4 h-full flex flex-col justify-between rounded-2xl">
                <div className="space-y-3.5">
                  <div className="p-3 w-fit rounded-xl kpi-icon-primary shadow-md">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-heading">Operations & Payroll</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Multi-department staff payroll disbursal, operating room scheduling, equipment asset
                    maintenance, and audit logging.
                  </p>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-border text-[11px] sm:text-xs font-mono text-kpi-primary font-bold">
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
          className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 mb-10 sm:mb-14"
          >
            <span className="badge badge-theme-primary text-xs font-mono font-bold uppercase tracking-wider px-3 py-1">
              SECURITY & COMPLIANCE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading">
              HIPAA Session Security & Zero-Trust Architecture
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Built with multi-layered defenses to safeguard Protected Health Information (PHI) and
              enforce role-based access control.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <SpotlightCard className="p-5 sm:p-6 space-y-3.5 sm:space-y-4 h-full flex flex-col justify-between rounded-2xl">
                <div className="space-y-3.5">
                  <div className="p-3 w-fit rounded-xl kpi-icon-warning shadow-md">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-heading">15-Minute Auto-Logout</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Automated activity tracking invalidates clinical sessions after 15 minutes of idle
                    time, preventing unauthorized terminal access in busy wards.
                  </p>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-border text-[11px] sm:text-xs font-mono text-kpi-warning font-bold">
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
              <SpotlightCard className="p-5 sm:p-6 space-y-3.5 sm:space-y-4 h-full flex flex-col justify-between rounded-2xl">
                <div className="space-y-3.5">
                  <div className="p-3 w-fit rounded-xl kpi-icon-success shadow-md">
                    <Key className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-heading">HttpOnly Session Cookies</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Session tokens are stored exclusively in HttpOnly, SameSite cookies that cannot be
                    accessed by client-side scripts, neutralizing XSS credential theft.
                  </p>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-border text-[11px] sm:text-xs font-mono text-kpi-success font-bold">
                  • XSS & Injection Immunity
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
              <SpotlightCard className="p-5 sm:p-6 space-y-3.5 sm:space-y-4 h-full flex flex-col justify-between rounded-2xl">
                <div className="space-y-3.5">
                  <div className="p-3 w-fit rounded-xl kpi-icon-info shadow-md">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-heading">Role-Based Access (RBAC)</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Strict cryptographic session verification ensures doctors, patients, and admins can only
                    access their authorized clinical datasets and operational endpoints.
                  </p>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-border text-[11px] sm:text-xs font-mono text-kpi-info font-bold">
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
          className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border"
        >
          <div className="p-6 sm:p-10 lg:p-12 rounded-2xl sm:rounded-3xl bg-card border border-border shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 relative overflow-hidden">
            <div className="card-accent-bar absolute top-0 left-0 right-0" />

            <div className="space-y-2 text-center md:text-left">
              <span className="text-[11px] font-mono text-primary uppercase tracking-widest font-bold">
                SYSTEM ENTRY
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-heading">
                Ready to Experience the Clinical Platform?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                Test pre-populated clinical records for Doctor, Patient, and Hospital Admin with
                instant one-click demo authentication.
              </p>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto shrink-0">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="btn-primary h-12 px-8 text-sm rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg">
                  <span>Sign In to System</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Modern Technical Footer */}
      <footer className="border-t border-border bg-card/40 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-semibold text-foreground">CureWell Hospital Management System</span>
            <span>— Clinical & Administrative Operations</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Oracle 19c Enterprise</span>
            <span>Next.js 16 (Turbopack)</span>
            <span>HIPAA Compliant Session Isolation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
