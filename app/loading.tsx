'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, ShieldCheck } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-xl flex items-center justify-center z-50 overflow-hidden">
      {/* Ambient background glow */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle, rgb(var(--primary)) 0%, rgb(var(--medical-teal)) 50%, transparent 80%)`
        }}
      />

      <div className="text-center space-y-6 relative z-10">
        {/* Main Animation Stage */}
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
          {/* Expanding Echocardiogram Pulse Waves */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1.8],
              opacity: [0.6, 0.2, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute w-36 h-36 rounded-full border border-primary/30 bg-primary/5 pointer-events-none"
          />

          <motion.div
            animate={{
              scale: [1, 1.3, 1.6],
              opacity: [0.7, 0.3, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.6,
            }}
            className="absolute w-36 h-36 rounded-full border border-primary/20 bg-primary/5 pointer-events-none"
          />

          {/* Outer Orbital Track (Dashed Ring) */}
          <div className="absolute w-48 h-48 rounded-full border border-dashed border-primary/30 pointer-events-none" />

          {/* Primary Orbiting Satellite (Activity Badge) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute w-48 h-48 rounded-full pointer-events-none"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="w-7 h-7 rounded-full bg-card border-2 border-primary shadow-lg flex items-center justify-center text-primary"
              >
                <Activity className="w-3.5 h-3.5 animate-pulse" />
              </motion.div>
            </div>
          </motion.div>

          {/* Secondary Counter-Orbiting Micro Beacon */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute w-40 h-40 rounded-full border border-border pointer-events-none"
          >
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full card-accent-bar shadow-md" />
          </motion.div>

          {/* Stable Central Heart Core */}
          <div className="relative w-28 h-28 rounded-3xl card-accent-bar p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full rounded-[22px] bg-card/90 backdrop-blur-md flex items-center justify-center relative overflow-hidden">
              {/* Subtle inner radial gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-destructive/10 to-transparent pointer-events-none" />

              {/* Rhythmic Anatomical Heartbeat Pulse */}
              <motion.div
                animate={{
                  scale: [1, 1.18, 0.98, 1.25, 1],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  times: [0, 0.15, 0.28, 0.45, 1],
                }}
                className="relative z-10 flex items-center justify-center"
              >
                <Heart className="w-14 h-14 text-destructive fill-destructive drop-shadow-md" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* ECG Rhythm Waveform */}
        <div className="flex justify-center">
          <svg width="120" height="24" viewBox="0 0 120 24" className="text-primary opacity-80">
            <motion.path
              d="M0,12 L35,12 L42,3 L48,21 L54,7 L60,17 L66,12 L120,12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0.3 }}
              animate={{
                pathLength: [0, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </svg>
        </div>

        {/* Typography & Status Progress */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h2 className="text-xl font-bold text-heading">
              Hospital Information System
            </h2>
          </div>

          <div className="flex items-center justify-center gap-2">
            <p className="text-xs text-muted-foreground font-medium tracking-wide">
              Loading clinical data & securing session
            </p>
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-1.5 h-1.5 bg-primary rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
