'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EcgSparklineProps {
  className?: string;
  color?: string;
  width?: number;
  height?: number;
  animated?: boolean;
}

export function EcgSparkline({
  className,
  color = '#10B981',
  width = 120,
  height = 36,
  animated = true,
}: EcgSparklineProps) {
  // Realistic ECG wave path (P wave, PR segment, QRS complex, ST segment, T wave)
  const pathD = 'M0,18 L24,18 L30,14 L34,18 L42,18 L46,6 L50,30 L54,2 L58,22 L62,18 L70,18 L76,12 L84,18 L120,18';

  return (
    <div className={cn('relative inline-flex items-center overflow-hidden', className)}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={`ecg-glow-${color.replace('#', '')}`} x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
          <filter id={`glow-${color.replace('#', '')}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Faint Baseline */}
        <path
          d={pathD}
          stroke={color}
          strokeWidth="1.5"
          strokeOpacity="0.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Animated Glow Waveform */}
        {animated ? (
          <motion.path
            d={pathD}
            stroke={`url(#ecg-glow-${color.replace('#', '')})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#glow-${color.replace('#', '')})`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1],
              pathOffset: [0, 0, 1],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ) : (
          <path
            d={pathD}
            stroke={`url(#ecg-glow-${color.replace('#', '')})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#glow-${color.replace('#', '')})`}
          />
        )}
      </svg>
    </div>
  );
}

export default EcgSparkline;
