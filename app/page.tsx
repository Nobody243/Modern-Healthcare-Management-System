'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Stethoscope,
  Users,
  Activity,
  ShieldCheck,
  Calendar,
  Database,
  Pill,
  FlaskConical,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  Server,
  HeartPulse,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SplineScene } from '@/components/ui/spline';

// --- FULL-WIDTH DEDICATED LIVE CLINICAL TELEMETRY COMMAND CENTER ---
function DedicatedClinicalTelemetry() {
  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-xl">
      {/* Window Header */}
      <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-rose-500/90" />
          <div className="w-3 h-3 rounded-full bg-amber-500/90" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
          <span className="ml-3 text-xs font-mono text-slate-300 font-bold">
            CureWell HMS // Enterprise Clinical Command Center
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="hidden sm:inline-block text-slate-400">
            Assigned: <strong className="text-cyan-400">Dr. Alexander Hayes</strong> (Chief of Cardiology)
          </span>
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold text-[11px]">
            Live Oracle Feed
          </span>
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-b from-slate-900/50 to-slate-950/90">
        {/* Panel 1: Live Patient Vitals Stream */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <HeartPulse className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Continuous Vitals</h4>
                <p className="text-xs text-slate-400">Alex Morgan (PAT001) • Age 48</p>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
              Normal Sinus
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-medium">Heart Pulse</p>
              <p className="text-2xl font-black text-rose-400 font-mono mt-0.5">72 BPM</p>
              <p className="text-[9px] text-slate-500">Normal: 60-100</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-medium">Blood Oxygen</p>
              <p className="text-2xl font-black text-cyan-400 font-mono mt-0.5">98% SpO2</p>
              <p className="text-[9px] text-slate-500">Target: 95-100%</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-medium">Blood Pressure</p>
              <p className="text-2xl font-black text-indigo-400 font-mono mt-0.5">120/80</p>
              <p className="text-[9px] text-slate-500">mmHg Optimal</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-medium">Body Temp</p>
              <p className="text-2xl font-black text-amber-400 font-mono mt-0.5">98.6 °F</p>
              <p className="text-[9px] text-slate-500">Normothermic</p>
            </div>
          </div>

          {/* Animated ECG Waveform */}
          <div className="pt-2">
            <svg width="100%" height="24" viewBox="0 0 200 24" className="text-rose-500">
              <motion.path
                d="M0,12 L50,12 L60,2 L70,22 L80,5 L90,17 L100,12 L200,12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
              />
            </svg>
          </div>
        </div>

        {/* Panel 2: Physician Schedule & Inpatient Surgeries */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Physician Queue</h4>
                <p className="text-xs text-slate-400">Dr. Alexander Hayes (DOC-DEMO)</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              Today
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-200">Cardiology Consultation</p>
                <p className="text-[10px] text-slate-400">Alex Morgan (PAT001) • 10:30 AM</p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Done
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-200">Angioplasty & Stenting</p>
                <p className="text-[10px] text-slate-400">OR-2 • In-Preparation</p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
                Operating
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-200">Heart Failure Follow-up</p>
                <p className="text-[10px] text-slate-400">Brian Harris (PAT013) • 03:00 PM</p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Scheduled
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>3 Inpatient Consultations Scheduled Today</span>
          </div>
        </div>

        {/* Panel 3: Oracle 19c & Lab Diagnostics Hub */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Oracle 19c Telemetry</h4>
                <p className="text-xs text-slate-400">22 Relational Tables</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              ONLINE
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-cyan-400" /> CMP & Lipid Lab Orders
                </span>
                <span className="font-mono text-slate-200 font-bold">100% Synced</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full w-[95%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-emerald-400" /> Lisinopril & Atorvastatin
                </span>
                <span className="font-mono text-slate-200 font-bold">Dispensed</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full w-[98%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-purple-400" /> ACID Commit Latency
                </span>
                <span className="font-mono text-purple-400 font-bold">18ms</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full w-[80%]" />
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-center justify-between font-mono">
            <span>Audit Trail Log</span>
            <span>1,280 txn/min</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activePortalTab, setActivePortalTab] = useState<'doctor' | 'patient' | 'admin'>('doctor');
  const [activeNav, setActiveNav] = useState<string>('hero');

  // Smooth scroll handler with persistent fixed header offset compensation
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const portalDetails = {
    doctor: {
      title: 'Clinical Doctor Portal',
      subtitle: 'Physician diagnostic workspace, EHR patient charting & surgical management',
      badge: 'Clinical Workflows',
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
      accentBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: Stethoscope,
      demoEmail: 'demo.doctor@curewell.com',
      features: [
        'EHR Patient Charting (Allergies, Medical Histories & Diagnoses)',
        'Real-Time Vital Sign Recording (Pulse, BP, Temp, Respiration, SpO2)',
        'Inpatient & Outpatient Surgical Scheduling (OR Assignments & Surgeries)',
        'Electronic Prescription Writing & Direct Pharmacy Dispatch',
        'Laboratory Diagnostic Test Requisitions (CMP, CBC, Cardiac Panels)',
      ],
      previewStats: [
        { label: 'Assigned Patients', val: '24 Active' },
        { label: 'Today Surgeries', val: '1 In-Progress' },
        { label: 'Pending Lab Reviews', val: '2 Awaiting' },
      ],
    },
    patient: {
      title: 'Patient Health Portal',
      subtitle: 'Personal health records, prescription instructions & vital telemetry tracker',
      badge: 'Patient Self-Service',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
      accentBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: Users,
      demoEmail: 'demo.patient@curewell.com',
      features: [
        'Instant Access to Digital Prescriptions (Dosages, Frequency, Status)',
        'Continuous Biometric Health Vitals Tracker with Historical Logs',
        'Laboratory Diagnostic Reports & Physician Recommendations',
        'Surgical History & Post-Operative Treatment Follow-ups',
        'Profile Security, Contact Information & Medical Alert Settings',
      ],
      previewStats: [
        { label: 'Active Prescriptions', val: '3 Current' },
        { label: 'Latest SpO2', val: '98% Optimal' },
        { label: 'Next Appointment', val: 'Cardiology (Fri)' },
      ],
    },
    admin: {
      title: 'Enterprise Operations Portal',
      subtitle: 'Hospital-wide infrastructure, pharmacy inventory & payroll management',
      badge: 'Hospital Operations',
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
      accentBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: Building2,
      demoEmail: 'demo.admin@curewell.com',
      features: [
        'Departmental Payroll Management & Salary Disbursal Processing',
        'Pharmacy Stock Control (Batch Numbers, Expiration Dates & Quantities)',
        'Hospital Equipment Asset Lifecycle & Preventive Maintenance Logs',
        'Doctor & Patient Credentialing, Licensing & Department Assignments',
        'Audit Trail Monitoring, Database Telemetry & User Access Control',
      ],
      previewStats: [
        { label: 'Hospital Staff', val: '148 Active' },
        { label: 'Pharmacy SKUs', val: '2,400 In Stock' },
        { label: 'Oracle DB Latency', val: '18ms (ACID)' },
      ],
    },
  };

  const currentPortal = portalDetails[activePortalTab];
  const PortalIcon = currentPortal.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden scroll-smooth">
      {/* Background Architectural Mesh & Subtle Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[1000px] h-[500px] bg-gradient-to-b from-cyan-600/15 via-blue-600/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-900/20 via-purple-900/10 to-transparent rounded-full blur-3xl" />
        {/* Engineering Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* FIXED PERSISTENT TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 shadow-lg shadow-black/20">
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
                <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  HMS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Enterprise Healthcare System</p>
            </div>
          </Link>

          {/* Smooth Scroll Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/70 p-1 rounded-full border border-slate-800/90 text-xs font-semibold text-slate-400">
            {[
              { id: 'hero', label: 'Overview' },
              { id: 'telemetry', label: 'Live Telemetry' },
              { id: 'portals', label: 'Clinical Portals' },
              { id: 'architecture', label: 'Oracle Architecture' },
              { id: 'security', label: 'Security & HIPAA' },
            ].map((navItem) => (
              <a
                key={navItem.id}
                href={`#${navItem.id}`}
                onClick={(e) => scrollToSection(e, navItem.id)}
                className={`relative px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
                  activeNav === navItem.id ? 'text-white' : 'hover:text-slate-200'
                }`}
              >
                {activeNav === navItem.id && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{navItem.label}</span>
              </a>
            ))}
          </nav>

          {/* Right Action & Oracle Status */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-slate-300 font-medium font-mono">
                Oracle 19c Online
              </span>
            </div>

            <Link href="/login">
              <Button className="h-9 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 rounded-lg cursor-pointer">
                Access Portals →
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="relative z-10 pt-16">
        {/* ========================================================================= */}
        {/* FULL-SCREEN HERO SECTION (LEFT: TEXT & ACTIONS, RIGHT: 3D SPLINE SCENE)   */}
        {/* ========================================================================= */}
        <section
          id="hero"
          className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8 lg:py-0 scroll-mt-20"
        >
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* LEFT SIDE (50%): HEADLINE, SMOOTH TRANSITIONS & BUTTONS */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Top Pill Badge with Smooth Fade */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.15)] text-xs font-semibold text-cyan-300"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Hospital Information System • Enterprise Clinical Platform</span>
              </motion.div>

              {/* Main Headline with Butter-Smooth Easing */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]"
              >
                Unified Hospital Operations,{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(34,211,238,0.35)] inline-block">
                  Clinical EHR
                </span>{' '}
                & Patient Telemetry
              </motion.h1>

              {/* Sub-headline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed"
              >
                An integrated platform engineered for hospital departments, clinical physicians, and
                patients. Backed by Oracle enterprise transactions, real-time vital charting, and
                true session isolation.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link href="/login">
                  <Button className="h-12 px-7 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 rounded-xl cursor-pointer flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Launch Live Portals
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <a
                  href="#telemetry"
                  onClick={(e) => scrollToSection(e, 'telemetry')}
                >
                  <Button
                    variant="outline"
                    className="h-12 px-6 bg-slate-900/60 hover:bg-slate-800 text-slate-200 border-slate-700 text-sm font-semibold rounded-xl cursor-pointer"
                  >
                    Explore Telemetry ↓
                  </Button>
                </a>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="pt-4 grid grid-cols-2 gap-3 text-xs text-slate-400 font-medium max-w-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Oracle 19c Enterprise DB</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>HIPAA Data Privacy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>15-Min Inactivity Timeout</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>True Session Cookies</span>
                </div>
              </motion.div>
            </div>

            {/* RIGHT SIDE (50%): INTERACTIVE 3D ANIMATED ROBOT (FULL-SCREEN FEEL) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -10, 0],
              }}
              transition={{
                opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              className="lg:col-span-6 relative w-full h-[520px] sm:h-[600px] lg:h-[680px] flex items-center justify-center overflow-visible select-none isolate transform-gpu"
            >
              {/* Subtle Ambient Backlight with Heartbeat Breathing */}
              <motion.div
                animate={{
                  opacity: [0.15, 0.25, 0.15],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute w-[460px] h-[460px] bg-gradient-to-tr from-cyan-500/20 via-blue-500/15 to-indigo-500/15 rounded-full blur-3xl pointer-events-none transform-gpu"
              />

              {/* Full 3D Interactive Spline Robot */}
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full pointer-events-auto relative z-10"
              />
            </motion.div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: DEDICATED FULL-WIDTH LIVE CLINICAL TELEMETRY COMMAND CENTER    */}
        {/* ========================================================================= */}
        <section
          id="telemetry"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-3 mb-10"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              Live Clinical Telemetry
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Continuous Patient Telemetry & Operational Flow
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
              Real-time synchronization across patient biometrics, active physician queues, and
              ACID database transactions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <DedicatedClinicalTelemetry />
          </motion.div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: 3-PORTAL INTERACTIVE NAVIGATOR (DOCTOR / PATIENT / ADMIN)       */}
        {/* ========================================================================= */}
        <section
          id="portals"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-3 mb-12"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              Role-Based Portals
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Three Dedicated Environments. One Hospital System.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
              Engineered with distinct security boundaries and purpose-built workflows for every
              healthcare stakeholder.
            </p>
          </motion.div>

          {/* Portal Selector Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-2xl flex gap-1.5">
              {(['doctor', 'patient', 'admin'] as const).map((tab) => {
                const Icon = portalDetails[tab].icon;
                const isActive = activePortalTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActivePortalTab(tab)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="capitalize">{tab} Portal</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Active Portal Showcase Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePortalTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="max-w-5xl mx-auto"
            >
              <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl border ${currentPortal.accentBg}`}>
                      <PortalIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${currentPortal.accentBg}`}>
                          {currentPortal.badge}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mt-1">{currentPortal.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{currentPortal.subtitle}</p>
                    </div>
                  </div>

                  <Link href="/login">
                    <Button className="h-11 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 rounded-xl cursor-pointer flex items-center gap-2">
                      <span>Launch Portal Demo</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Capabilities List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
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

                  {/* Portal Telemetry Preview */}
                  <div className="p-6 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Operational Status Snapshot
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {currentPortal.previewStats.map((stat, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                            <p className="text-[10px] text-slate-400">{stat.label}</p>
                            <p className="text-sm font-bold text-cyan-400 mt-1">{stat.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Pre-configured Demo Account:</span>
                      <span className="font-mono text-cyan-300 font-medium">
                        {currentPortal.demoEmail}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: TECHNICAL ARCHITECTURE BENTO GRID                             */}
        {/* ========================================================================= */}
        <section
          id="architecture"
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-3 mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              Technical Architecture
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Oracle 19c Relational Core</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full relational integrity with foreign keys, check constraints, sequences, and ACID
                transaction rollback safeguards.
              </p>
              <div className="text-[11px] font-mono text-purple-400 font-semibold">
                • 22 Relational DB Tables
              </div>
            </motion.div>

            {/* Bento Card 2: Vital Telemetry */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="p-3 w-fit rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Continuous Vital Telemetry</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tracks heart pulse, blood pressure, respiration, body temp, and oxygen saturation with
                automated normal range validation.
              </p>
              <div className="text-[11px] font-mono text-rose-400 font-semibold">
                • 5 Biometric Parameters Monitored
              </div>
            </motion.div>

            {/* Bento Card 3: Pharmacy & Asset Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Pharmacy & Inventory Stock</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tracks batches, expiration dates, stock depletion alerts, supplier procurement, and
                prescription dispensing.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 font-semibold">
                • Zero Stock-Out Safeguards
              </div>
            </motion.div>

            {/* Bento Card 4: Security & Session Isolation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors scroll-mt-20"
              id="security"
            >
              <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">HIPAA Session Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                15-minute inactivity auto-logout, true browser session cookies, sleep/suspend
                detection, and strict role authorization.
              </p>
              <div className="text-[11px] font-mono text-cyan-400 font-semibold">
                • Auto Invalidation & True Cookies
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: ENTERPRISE METRICS BANNER                                      */}
        {/* ========================================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900"
        >
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900/60 to-slate-950 border border-cyan-500/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
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
                <Button className="h-12 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 rounded-xl cursor-pointer">
                  Sign In to System →
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
          <div className="flex items-center gap-6">
            <span>Oracle 19c Enterprise</span>
            <span>Next.js 16 (Turbopack)</span>
            <span>HIPAA Compliant Session Isolation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
