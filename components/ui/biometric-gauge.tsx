'use client';
import React from 'react';
import { cn } from '@/lib/utils';

export type BiometricType = 'bp' | 'heart_rate' | 'temperature' | 'spo2' | 'respiration';

export interface BiometricGaugeProps {
  type: BiometricType;
  value: string | number;
  label?: string;
  unit?: string;
  className?: string;
}

interface MetricStatus {
  status: 'optimal' | 'elevated' | 'alert' | 'normal';
  statusText: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  dotColor: string;
  percentage: number;
}

export function evaluateBiometric(type: BiometricType, value: string | number): MetricStatus {
  const valStr = String(value || '').trim();

  if (type === 'bp') {
    // Blood Pressure e.g. "120/80"
    const parts = valStr.split('/').map(p => parseInt(p, 10));
    const sys = parts[0] || 120;
    const dia = parts[1] || 80;

    if (sys >= 140 || dia >= 90 || sys < 90) {
      return {
        status: 'alert',
        statusText: 'Hypertensive / Alert',
        colorClass: 'text-rose-600 dark:text-rose-400',
        bgClass: 'bg-rose-500/15',
        borderClass: 'border-rose-500/30',
        dotColor: '#F43F5E',
        percentage: Math.min(100, Math.max(10, (sys / 180) * 100)),
      };
    }
    if (sys >= 125 || dia >= 84) {
      return {
        status: 'elevated',
        statusText: 'Pre-Hypertension',
        colorClass: 'text-amber-600 dark:text-amber-400',
        bgClass: 'bg-amber-500/15',
        borderClass: 'border-amber-500/30',
        dotColor: '#F59E0B',
        percentage: 65,
      };
    }
    return {
      status: 'optimal',
      statusText: 'Optimal Range',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-500/15',
      borderClass: 'border-emerald-500/30',
      dotColor: '#10B981',
      percentage: 50,
    };
  }

  const num = typeof value === 'number' ? value : parseFloat(valStr) || 0;

  if (type === 'heart_rate') {
    // Heart Rate bpm
    if (num > 100 || (num > 0 && num < 50)) {
      return {
        status: 'alert',
        statusText: num > 100 ? 'Tachycardia' : 'Bradycardia',
        colorClass: 'text-rose-600 dark:text-rose-400',
        bgClass: 'bg-rose-500/15',
        borderClass: 'border-rose-500/30',
        dotColor: '#F43F5E',
        percentage: Math.min(100, (num / 150) * 100),
      };
    }
    if (num > 85) {
      return {
        status: 'elevated',
        statusText: 'Elevated Pulse',
        colorClass: 'text-amber-600 dark:text-amber-400',
        bgClass: 'bg-amber-500/15',
        borderClass: 'border-amber-500/30',
        dotColor: '#F59E0B',
        percentage: 70,
      };
    }
    return {
      status: 'optimal',
      statusText: 'Normal Rhythm',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-500/15',
      borderClass: 'border-emerald-500/30',
      dotColor: '#10B981',
      percentage: 50,
    };
  }

  if (type === 'temperature') {
    // Body Temp in Celsius e.g. 37.0 or Fahrenheit e.g. 98.6
    const isF = num > 50;
    const isFever = isF ? num >= 100.4 : num >= 38.0;
    const isLowGrade = isF ? num >= 99.5 : num >= 37.5;

    if (isFever) {
      return {
        status: 'alert',
        statusText: 'Pyrexia / Fever',
        colorClass: 'text-rose-600 dark:text-rose-400',
        bgClass: 'bg-rose-500/15',
        borderClass: 'border-rose-500/30',
        dotColor: '#F43F5E',
        percentage: 85,
      };
    }
    if (isLowGrade) {
      return {
        status: 'elevated',
        statusText: 'Low Grade Temp',
        colorClass: 'text-amber-600 dark:text-amber-400',
        bgClass: 'bg-amber-500/15',
        borderClass: 'border-amber-500/30',
        dotColor: '#F59E0B',
        percentage: 65,
      };
    }
    return {
      status: 'optimal',
      statusText: 'Normothermic',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-500/15',
      borderClass: 'border-emerald-500/30',
      dotColor: '#10B981',
      percentage: 50,
    };
  }

  if (type === 'spo2') {
    // Oxygen Saturation %
    if (num < 92 && num > 0) {
      return {
        status: 'alert',
        statusText: 'Hypoxemia Alert',
        colorClass: 'text-rose-600 dark:text-rose-400',
        bgClass: 'bg-rose-500/15',
        borderClass: 'border-rose-500/30',
        dotColor: '#F43F5E',
        percentage: 30,
      };
    }
    if (num < 95 && num > 0) {
      return {
        status: 'elevated',
        statusText: 'Borderline O2',
        colorClass: 'text-amber-600 dark:text-amber-400',
        bgClass: 'bg-amber-500/15',
        borderClass: 'border-amber-500/30',
        dotColor: '#F59E0B',
        percentage: 60,
      };
    }
    return {
      status: 'optimal',
      statusText: 'Adequate Oxygenation',
      colorClass: 'text-cyan-600 dark:text-cyan-400',
      bgClass: 'bg-cyan-500/15',
      borderClass: 'border-cyan-500/30',
      dotColor: '#06B6D4',
      percentage: 95,
    };
  }

  return {
    status: 'normal',
    statusText: 'Normal Range',
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-500/15',
    borderClass: 'border-emerald-500/30',
    dotColor: '#10B981',
    percentage: 50,
  };
}

export function BiometricGauge({
  type,
  value,
  label,
  unit,
  className,
}: BiometricGaugeProps) {
  const meta = evaluateBiometric(type, value);

  return (
    <div className={cn('p-3 rounded-xl bg-card border border-border shadow-sm flex flex-col justify-between', className)}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label || type.toUpperCase()}
        </span>
        <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1', meta.bgClass, meta.colorClass, meta.borderClass)}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: meta.dotColor }} />
          {meta.statusText}
        </span>
      </div>

      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className={cn('font-mono text-xl font-bold tracking-tight', meta.colorClass)}>
          {value || '--'}
        </span>
        {unit && <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{unit}</span>}
      </div>

      {/* Mini Gauge Progress Line */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${meta.percentage}%`,
            backgroundColor: meta.dotColor,
          }}
        />
      </div>
    </div>
  );
}

export default BiometricGauge;
