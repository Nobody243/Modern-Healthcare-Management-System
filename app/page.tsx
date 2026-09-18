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

// ============================================================================
// ZERO-RERENDER DYNAMIC CURSOR GLOW (GPU HARDWARE ACCELERATED)
// ============================================================================
function CursorGlow() {
  const cursorX = useMotionValue(-500);
  const cursorY = useMotionValue(-500);
  const opacity = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.1 };
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
    <motion.div
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
        opacity,
      }}
      className="pointer-events-none fixed top-0 left-0 z-30 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.12)_0%,rgba(59,130,246,0.04)_45%,transparent_70%)] blur-2xl transform-gpu will-change-transform"
    />
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
      className={`group relative overflow-hidden rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-0.5 transform-gpu will-change-transform ${className}`}
    >
      {/* Studio Keylight Spotlight Beam (Compositor Level) */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform-gpu"
        style={{
          background:
            'radial-gradient(450px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), rgba(56, 189, 248, 0.12), transparent 70%)',
        }}
      />
      {/* Subtle Metallic Top Bevel */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
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
      accentBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
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
      accentBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
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
      accentBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Interactive GPU Cursor Glow Beam */}
      <CursorGlow />

      {/* Top 1:1 Instant Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 z-50 origin-left pointer-events-none transform-gpu will-change-transform shadow-[0_0_10px_rgba(34,211,238,0.8)]"
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
      />

      {/* Background Architectural Grid & Subtle Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute top-[60%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
      </div>

      {/* FIXED PERSISTENT TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 shadow-xl shadow-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-slate-950 font-extrabold stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  CureWell
                </span>
                <span className="text-cyan-400 font-bold text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                  HMS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Enterprise Healthcare System</p>
            </div>
          </Link>

          {/* Desktop Smooth Scroll Navigation Links with Spring Pill */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-full border border-slate-800/90 text-xs font-semibold text-slate-400">
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
                  className={`relative px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
                    isActive ? 'text-white' : 'hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{navItem.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action & System Status */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-slate-300 font-medium">
                ORACLE 19c: <span className="text-emerald-400 font-bold">ONLINE</span>
              </span>
            </div>

            <Link href="/login">
              <Button className="h-9 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all">
                <span>Access Portals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-2"
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
                  onClick={(e) => scrollToSection(e, navItem.id)}
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                    activeNav === navItem.id
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {navItem.label}
                </a>
              ))}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Oracle 19c Engine</span>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="h-8 px-3 bg-cyan-500 text-slate-950 font-bold text-xs rounded-md">
                    Sign In
                  </Button>
                </Link>
              </div>
            </motion.div>
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
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.15)] text-xs font-semibold text-cyan-300"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
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
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]"
              >
                Unified Hospital Operations,{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(34,211,238,0.35)] inline-block">
                  Clinical EHR
                </span>{' '}
                & Patient Care
              </motion.h1>

              {/* Sub-headline */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed"
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
                className="flex flex-wrap items-center gap-4 pt-1"
              >
                <Link href="/login">
                  <Button className="h-12 px-7 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 rounded-xl cursor-pointer flex items-center gap-2 transition-all">
                    <Sparkles className="w-4 h-4" />
                    <span>Launch Live Portals</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <a
                  href="#portals"
                  onClick={(e) => scrollToSection(e, 'portals')}
                >
                  <Button
                    variant="outline"
                    className="h-12 px-6 bg-slate-900/60 hover:bg-slate-800 text-slate-200 border-slate-700 text-sm font-semibold rounded-xl cursor-pointer transition-all"
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
                className="pt-2 grid grid-cols-2 gap-3 text-xs text-slate-400 font-medium max-w-lg"
              >
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Oracle 19c Enterprise DB</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>HIPAA Grade Privacy</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>15-Min Inactivity Timeout</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>HttpOnly Session Tokens</span>
                </div>
              </motion.div>
            </div>

            {/* RIGHT SIDE (50%): 3D SPLINE ROBOT */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative w-full h-[480px] sm:h-[560px] lg:h-[620px] flex items-center justify-center overflow-visible select-none isolate transform-gpu"
            >
              {/* Anamorphic Horizon Line Flare */}
              <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

              {/* Floating HUD Reticles */}
              <div className="absolute top-6 left-6 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 font-mono text-[10px] text-cyan-300 backdrop-blur-sm">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>AI_DIAGNOSTIC_ASSIST: ACTIVE</span>
              </div>

              <div className="absolute bottom-6 right-6 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 font-mono text-[10px] text-emerald-300 backdrop-blur-sm">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>SYSTEM STATUS: OPERATIONAL</span>
              </div>

              {/* Full 3D Interactive Spline Robot */}
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full pointer-events-auto relative z-10"
              />
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SCENE 02: 3-TIER OPERATIONAL WORKSPACES (DOCTOR / PATIENT / ADMIN)        */}
        {/* ========================================================================= */}
        <section
          id="portals"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 mb-12"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              ROLE-BASED CLINICAL WORKSPACES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Three Dedicated Environments. One Hospital System.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
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
            className="flex justify-center mb-8"
          >
            <div className="p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex gap-1.5 relative">
              {(['doctor', 'patient', 'admin'] as const).map((tab) => {
                const Icon = portalDetails[tab].icon;
                const isActive = activePortalTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActivePortalTab(tab)}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      isActive
                        ? 'text-slate-950 font-extrabold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePortalTabPill"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/30"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="capitalize">{tab} Portal</span>
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
              <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950 border border-slate-800 shadow-2xl space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl border ${currentPortal.accentBg}`}>
                      <PortalIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${currentPortal.accentBg}`}
                        >
                          {currentPortal.badge}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mt-1.5">{currentPortal.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{currentPortal.subtitle}</p>
                    </div>
                  </div>

                  <Link href="/login">
                    <Button className="h-11 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 rounded-xl cursor-pointer flex items-center gap-2 transition-all">
                      <span>Launch Portal Demo</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Capabilities List */}
                  <div className="space-y-3.5">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      Core Functional Capabilities
                    </h4>
                    <ul className="space-y-2.5">
                      {currentPortal.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Portal Telemetry Snapshot */}
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-5 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Operational Status Snapshot
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {currentPortal.previewStats.map((stat, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-900/80 border border-slate-800"
                          >
                            <p className="text-[10px] text-slate-400 font-mono">{stat.label}</p>
                            <p className="text-sm font-bold text-cyan-400 mt-1 font-mono">
                              {stat.val}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pre-configured Demo Account with One-Click Copy */}
                    <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-mono">
                          Pre-configured Demo Account
                        </p>
                        <p className="font-mono text-cyan-300 font-semibold mt-0.5">
                          {currentPortal.demoEmail}
                        </p>
                      </div>
                      <button
                        onClick={() => copyDemoCreds(currentPortal.demoEmail)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedEmail === currentPortal.demoEmail ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
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
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 mb-14"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              ENTERPRISE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Enterprise Resilience & Clinical Precision
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
              Engineered with full ACID compliance on Oracle 19c and multi-layered clinical safety
              protocols.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Bento Card 1: Oracle Database */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <SpotlightCard className="p-6 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Oracle 19c Relational Core</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Full relational integrity with foreign keys, check constraints, sequences, and ACID
                    transaction rollback safeguards.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-purple-400 font-semibold">
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
              <SpotlightCard className="p-6 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 w-fit rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Clinical EHR & Vitals Charting</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tracks pulse, blood pressure, respiration, body temp, and SpO2 alongside allergy records
                    and diagnostic requisitions.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-rose-400 font-semibold">
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
              <SpotlightCard className="p-6 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Pill className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Pharmacy & Inventory Stock</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tracks batch LOTs, expiration dates, stock depletion alerts, supplier procurement, and
                    prescription dispensing.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400 font-semibold">
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
              <SpotlightCard className="p-6 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Hospital Operations & Payroll</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Multi-department staff payroll disbursal, operating room scheduling, equipment asset
                    maintenance, and audit logging.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-cyan-400 font-semibold">
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
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 mb-14"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              SECURITY & COMPLIANCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              HIPAA Session Security & Zero-Trust Architecture
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
              Built with multi-layered defenses to safeguard Protected Health Information (PHI) and
              enforce role-based access control.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <SpotlightCard className="p-6 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">15-Minute Inactivity Auto-Logout</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automated activity tracking invalidates clinical sessions after 15 minutes of idle
                    time, preventing unauthorized terminal access in busy wards.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-cyan-400 font-semibold">
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
              <SpotlightCard className="p-6 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Key className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">True HttpOnly Browser Session Cookies</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Session tokens are stored exclusively in HttpOnly, SameSite cookies that cannot be
                    accessed by client-side scripts, neutralizing XSS credential theft.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400 font-semibold">
                  • XSS & Injection Immunity
                </div>
              </SpotlightCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <SpotlightCard className="p-6 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Role-Based Access Control (RBAC)</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Strict cryptographic session verification ensures doctors, patients, and admins can only
                    access their authorized clinical datasets and operational endpoints.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-purple-400 font-semibold">
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
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900"
        >
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

            <div className="space-y-2 text-center md:text-left">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                SYSTEM ENTRY
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Ready to Experience the Clinical Platform?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Test pre-populated clinical records for Doctor, Patient, and Hospital Admin with
                instant one-click demo authentication.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button className="h-12 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 rounded-xl cursor-pointer flex items-center gap-2 transition-all">
                  <span>Sign In to System</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Modern Technical Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-semibold text-slate-300">CureWell Hospital Management System</span>
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
