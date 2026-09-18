'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
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
  Radio,
  Sliders,
  Terminal,
  ChevronRight,
  Copy,
  Check,
  Zap,
  Layers,
  FileText,
  AlertCircle,
  Eye,
  Crosshair,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SplineScene } from '@/components/ui/spline';

// ============================================================================
// CINEMATIC MOUSE-AWARE SPOTLIGHT CARD CONTAINER
// ============================================================================
function SpotlightCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl transition-all duration-300 hover:border-slate-700/90 hover:shadow-2xl hover:shadow-cyan-500/5 ${className}`}
    >
      {/* Studio Keylight Spotlight Beam */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 transform-gpu"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.12), transparent 70%)`,
        }}
      />
      {/* Subtle Metallic Top Bevel */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ============================================================================
// CINEMATIC LIVE CLINICAL TELEMETRY COMMAND CENTER (MULTI-CHANNEL STREAM)
// ============================================================================
function CinematicTelemetryCenter() {
  const [activeChannel, setActiveChannel] = useState<'icu' | 'or' | 'oracle'>('icu');
  const [bpm, setBpm] = useState(74);
  const [spo2, setSpo2] = useState(98);
  const [bp, setBp] = useState('120/80');
  const [pulseCount, setPulseCount] = useState(1);
  const [simMessage, setSimMessage] = useState<string | null>(null);

  // Live ECG Heartbeat pulse simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount((prev) => prev + 1);
      // Subtle natural biological fluctuation
      setBpm((prev) => 72 + Math.floor(Math.sin(Date.now() / 3000) * 3));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const triggerSimulation = (type: 'spike' | 'normal' | 'commit') => {
    if (type === 'spike') {
      setBpm(112);
      setSpo2(95);
      setBp('138/92');
      setSimMessage('TACHYCARDIA EVENT RECORDED - TRIAGE ESCALATION NOTIFIED');
    } else if (type === 'normal') {
      setBpm(74);
      setSpo2(99);
      setBp('120/80');
      setSimMessage('NORMAL SINUS RESTORED - VITALS WITHIN NOMINAL BASELINE');
    } else {
      setSimMessage('ORACLE 19c COMMIT EXECUTED // ACID LATENCY: 14MS // TXN ID: #88392');
    }

    setTimeout(() => {
      setSimMessage(null);
    }, 4500);
  };

  return (
    <div className="rounded-3xl bg-slate-950/90 border border-slate-800/90 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-2xl">
      {/* Studio Film HUD Header */}
      <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-4">
        {/* Left Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-200">
              STREAM://HMS-CORE-01.LIVE
            </span>
          </div>
        </div>

        {/* Center Multi-Channel Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950/90 border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveChannel('icu')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeChannel === 'icu'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CH 01: CARDIAC ICU
          </button>
          <button
            onClick={() => setActiveChannel('or')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeChannel === 'or'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CH 02: OR SUITE 2
          </button>
          <button
            onClick={() => setActiveChannel('oracle')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeChannel === 'oracle'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CH 03: ORACLE 19c
          </button>
        </div>

        {/* Right Status Badge */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
            ACID BUFFER: SYNCED
          </span>
        </div>
      </div>

      {/* Main Multi-Channel Broadcast Stage */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-b from-slate-900/40 via-slate-950/70 to-slate-950">
        {/* Left Telemetry Feed (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {activeChannel === 'icu' && (
              <motion.div
                key="icu"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-5"
              >
                {/* Patient Header */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <HeartPulse className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">Alex Morgan</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-semibold">
                          PAT001 • BED ICU-4
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Attending Physician: Dr. Alexander Hayes (Cardiology)
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    STATUS: STABLE
                  </span>
                </div>

                {/* 4 Biometric Metric Boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/15 transition-all" />
                    <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Heart Pulse
                    </p>
                    <p className="text-2xl font-black font-mono text-rose-400 mt-1">
                      {bpm} <span className="text-xs font-normal text-slate-400">BPM</span>
                    </p>
                    <p className="text-[9px] text-slate-500 mt-1 font-mono">Range: 60-100</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/15 transition-all" />
                    <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      SpO2 Blood O2
                    </p>
                    <p className="text-2xl font-black font-mono text-cyan-400 mt-1">
                      {spo2}% <span className="text-xs font-normal text-slate-400">SpO2</span>
                    </p>
                    <p className="text-[9px] text-slate-500 mt-1 font-mono">Nominal: &gt;95%</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/15 transition-all" />
                    <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Blood Pressure
                    </p>
                    <p className="text-2xl font-black font-mono text-indigo-400 mt-1">
                      {bp} <span className="text-xs font-normal text-slate-400">mmHg</span>
                    </p>
                    <p className="text-[9px] text-slate-500 mt-1 font-mono">Systolic/Diastolic</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/15 transition-all" />
                    <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Body Temp
                    </p>
                    <p className="text-2xl font-black font-mono text-amber-400 mt-1">
                      98.6 <span className="text-xs font-normal text-slate-400">°F</span>
                    </p>
                    <p className="text-[9px] text-slate-500 mt-1 font-mono">Normothermic</p>
                  </div>
                </div>

                {/* Sweep-bar Continuous ECG Rhythm Screen */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-rose-400">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span className="font-bold">LEAD II // CONTINUOUS REAL-TIME VECTOR</span>
                    </div>
                    <span className="text-slate-500">SWEEP SPEED: 25mm/s</span>
                  </div>

                  {/* High-Precision ECG Waveform SVG with Film Sweep */}
                  <div className="relative h-16 w-full overflow-hidden flex items-center bg-slate-950/90 rounded-lg border border-slate-900">
                    {/* Grid Lines */}
                    <div
                      className="absolute inset-0 opacity-15"
                      style={{
                        backgroundImage:
                          'linear-gradient(rgba(244, 63, 94, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(244, 63, 94, 0.4) 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                      }}
                    />

                    {/* Animated Moving Waveform */}
                    <svg
                      width="100%"
                      height="48"
                      viewBox="0 0 600 48"
                      preserveAspectRatio="none"
                      className="relative z-10 text-rose-400"
                    >
                      <motion.path
                        d="M0,24 L60,24 L70,24 L75,10 L85,42 L95,6 L105,32 L115,24 L160,24 L210,24 L215,10 L225,42 L235,6 L245,32 L255,24 L300,24 L350,24 L355,10 L365,42 L375,6 L385,32 L395,24 L440,24 L490,24 L495,10 L505,42 L515,6 L525,32 L535,24 L600,24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathOffset: 0 }}
                        animate={{ pathOffset: [0, -1] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                      />
                    </svg>

                    {/* Laser Scanner Bar */}
                    <motion.div
                      animate={{ left: ['0%', '100%'] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-rose-300 via-rose-500 to-transparent shadow-[0_0_12px_rgba(244,63,94,1)] pointer-events-none z-20"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeChannel === 'or' && (
              <motion.div
                key="or"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">OR Suite 02: Angioplasty & Stenting</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Surgeon: Dr. Alexander Hayes • Anesthesiologist: Dr. Karen Vance
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse font-bold">
                    IN-OPERATION
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-200">Patient Prep & Anesthesia Induction</p>
                      <p className="text-[10px] text-slate-400">OR-02 Baseline Vitals Verified</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                      COMPLETE (08:30 AM)
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between border-l-2 border-l-cyan-400">
                    <div>
                      <p className="text-xs font-bold text-cyan-300">Coronary Stent Deployment</p>
                      <p className="text-[10px] text-slate-400">Left Anterior Descending Artery (LAD)</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold animate-pulse">
                      ACTIVE STEP (10:15 AM)
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-300">Post-Op Recovery Room Transfer (PACU)</p>
                      <p className="text-[10px] text-slate-400">Assigned Nurse: Sarah Jenkins</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      SCHEDULED (11:45 AM)
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeChannel === 'oracle' && (
              <motion.div
                key="oracle"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Oracle 19c Relational Transaction Engine</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        22 Normalized Tables • Foreign Key Constraints Active
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold">
                    ACID VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                    <p className="text-[10px] font-mono text-slate-400">Commit Latency</p>
                    <p className="text-xl font-bold font-mono text-purple-400 mt-1">14.2 ms</p>
                    <p className="text-[9px] text-slate-500">P99 SLA &lt; 25ms</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                    <p className="text-[10px] font-mono text-slate-400">Txn Velocity</p>
                    <p className="text-xl font-bold font-mono text-cyan-400 mt-1">1,420 /min</p>
                    <p className="text-[9px] text-slate-500">Continuous Logging</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                    <p className="text-[10px] font-mono text-slate-400">Active Locks</p>
                    <p className="text-xl font-bold font-mono text-emerald-400 mt-1">0 Deadlocks</p>
                    <p className="text-[9px] text-slate-500">Row-Level Locking</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-400 border border-slate-800 space-y-1">
                  <p className="text-cyan-400 font-bold">SQL&gt; EXECUTE DBMS_HMS_TRANSACTION.RECORD_VITALS;</p>
                  <p className="text-slate-300">&gt; INSERT INTO PATIENT_VITALS (PAT_ID, PULSE, SPO2, STATUS) VALUES (&apos;PAT001&apos;, 74, 98, &apos;NOMINAL&apos;);</p>
                  <p className="text-emerald-400">&gt; 1 ROW CREATED. COMMIT COMPLETE. [AUDIT RECORD GENERATED]</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Live Director Interaction Stage (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Live Event Simulation Deck
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">INTERACTIVE</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Test dynamic system response in real-time. Trigger simulated clinical state changes to
              observe instant telemetry synchronization.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => triggerSimulation('spike')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/50 text-left text-xs font-semibold text-rose-300 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Simulate Tachycardia Spike (112 BPM)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => triggerSimulation('normal')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 text-left text-xs font-semibold text-emerald-300 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Restore Normal Sinus Baseline (74 BPM)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => triggerSimulation('commit')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 text-left text-xs font-semibold text-purple-300 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>Execute Oracle ACID Commit Log</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Simulation Feedback Alert */}
            <AnimatePresence>
              {simMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0 animate-bounce" />
                  <span className="leading-snug">{simMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Launch Deep Link */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Direct Clinical Dashboard Access</p>
              <p className="text-[10px] text-slate-400">Authenticated demo doctor session ready</p>
            </div>
            <Link href="/login">
              <Button className="h-9 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 rounded-lg cursor-pointer">
                Enter Portal →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN CINEMATIC HOME COMPONENT
// ============================================================================
export default function HomePage() {
  const [activePortalTab, setActivePortalTab] = useState<'doctor' | 'patient' | 'admin'>('doctor');
  const [activeNav, setActiveNav] = useState<string>('hero');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [liveTimecode, setLiveTimecode] = useState('00:00:00:00');

  // Smooth scroll progress bar with Framer Motion spring physics
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Real-time movie timecode simulation (HH:MM:SS:FF)
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      const ff = String(Math.floor((now.getMilliseconds() / 1000) * 60)).padStart(2, '0');
      setLiveTimecode(`${hh}:${mm}:${ss}:${ff}`);
    };
    const timer = setInterval(updateTimer, 50);
    return () => clearInterval(timer);
  }, []);

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
      accentColor: 'text-cyan-400',
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
      subtitle: 'Self-service medical records, prescription instructions & vital telemetry tracker',
      badge: 'Patient Self-Service',
      accentColor: 'text-emerald-400',
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
      accentColor: 'text-purple-400',
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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden scroll-smooth">
      {/* Top Cinematic Film Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Background Architectural Grid & Precision Laser Scan Lines (Zero AI Blobs) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Fine Engineering Blueprint Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Subtle Horizontal Anamorphic Lens Flare Lines */}
        <div className="absolute top-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute top-[60%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
      </div>

      {/* FIXED PERSISTENT TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80 shadow-2xl shadow-black/40">
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

          {/* Smooth Scroll Chapter Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-full border border-slate-800/90 text-xs font-semibold text-slate-400">
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

          {/* Right Action & Film Timecode Status */}
          <div className="flex items-center gap-3.5">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-slate-300 font-medium">
                REC <span className="text-cyan-400">{liveTimecode}</span>
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
        {/* SCENE 01: CINEMATIC HERO (SPLIT GRID WITH 3D ROBOT & HUD TARGET OVERLAYS) */}
        {/* ========================================================================= */}
        <section
          id="hero"
          className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12 lg:py-0 scroll-mt-20"
        >
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* LEFT SIDE (50%): HEADLINE, SMOOTH TRANSITIONS & ACTIONS */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Scene 01 Filmic Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.15)] text-xs font-semibold text-cyan-300"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-mono text-[11px] uppercase tracking-wider">
                  SCENE 01 // ENTERPRISE CLINICAL PLATFORM
                </span>
              </motion.div>

              {/* Main Headline with Cinematic Typography */}
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
                strict session security.
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

              {/* Cinematic Trust Rail */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="pt-4 grid grid-cols-2 gap-3 text-xs text-slate-400 font-medium max-w-lg"
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

            {/* RIGHT SIDE (50%): 3D INTERACTIVE ROBOT WITH HUD TARGETING RETICLES */}
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
              {/* Subtle Studio Anamorphic Horizon Flare (Zero Fuzzy Blobs) */}
              <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

              {/* Floating HUD Reticles */}
              <div className="absolute top-8 left-8 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 font-mono text-[10px] text-cyan-300">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>AI_DIAGNOSTIC_ASSIST: ACTIVE</span>
              </div>

              <div className="absolute bottom-8 right-8 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 font-mono text-[10px] text-emerald-300">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>LATENCY: 4.2ms // 60 FPS</span>
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
        {/* SCENE 02: DEDICATED LIVE CLINICAL TELEMETRY COMMAND CENTER               */}
        {/* ========================================================================= */}
        <section
          id="telemetry"
          className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-3 mb-12"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              SCENE 02 // MULTI-CHANNEL TELEMETRY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Continuous Patient Telemetry & Operational Flow
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
              Real-time synchronization across patient biometrics, active surgical queues, and
              Oracle ACID database transactions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <CinematicTelemetryCenter />
          </motion.div>
        </section>

        {/* ========================================================================= */}
        {/* SCENE 03: 3-TIER OPERATIONAL WORKSPACES (DOCTOR / PATIENT / ADMIN)        */}
        {/* ========================================================================= */}
        <section
          id="portals"
          className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-3 mb-12"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              SCENE 03 // ROLE-BASED WORKSPACES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Three Dedicated Environments. One Hospital System.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
              Engineered with distinct security boundaries and purpose-built clinical workflows for
              every healthcare stakeholder.
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
            <div className="p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex gap-1.5">
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
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
                    <Button className="h-11 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 rounded-xl cursor-pointer flex items-center gap-2">
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
        {/* SCENE 04: TECHNICAL ARCHITECTURE BENTO GRID WITH SPOTLIGHT REFLECTIONS   */}
        {/* ========================================================================= */}
        <section
          id="architecture"
          className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 scroll-mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-3 mb-14"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              SCENE 04 // SYSTEM ARCHITECTURE
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

            {/* Bento Card 2: Vital Telemetry */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SpotlightCard className="p-6 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 w-fit rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Continuous Vital Telemetry</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tracks heart pulse, blood pressure, respiration, body temp, and oxygen saturation with
                    automated normal range validation.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-rose-400 font-semibold">
                  • 5 Biometric Parameters
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Bento Card 3: Pharmacy & Asset Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
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

            {/* Bento Card 4: Security & Session Isolation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.4 }}
              id="security"
              className="scroll-mt-20"
            >
              <SpotlightCard className="p-6 space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">HIPAA Session Security</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    15-minute inactivity auto-logout, true browser session cookies, sleep/suspend
                    detection, and strict role authorization.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80 text-[11px] font-mono text-cyan-400 font-semibold">
                  • Auto Invalidation & True Cookies
                </div>
              </SpotlightCard>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SCENE 05: CINEMATIC CALL TO ACTION BANNER                                 */}
        {/* ========================================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900"
        >
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Anamorphic Line Accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

            <div className="space-y-2 text-center md:text-left">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                SCENE 05 // SYSTEM ENTRY
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
                <Button className="h-12 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 rounded-xl cursor-pointer flex items-center gap-2">
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
