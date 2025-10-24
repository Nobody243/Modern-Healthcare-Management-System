'use client';
import React from 'react';
import { 
  Heart, 
  Brain, 
  Scan, 
  Scissors, 
  Baby, 
  Flame, 
  Activity, 
  FlaskConical, 
  Pill, 
  ShieldAlert, 
  Bone, 
  Sun, 
  Sparkles, 
  Stethoscope, 
  Building2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DepartmentConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  className: string;
}

export function getDepartmentConfig(deptName?: string): DepartmentConfig {
  const d = (deptName || '').toLowerCase().trim();

  if (d.includes('cardio') || d.includes('heart')) {
    return {
      key: 'cardiology',
      label: deptName || 'Cardiology',
      icon: Heart,
      className: 'badge-dept-cardiology',
    };
  }
  if (d.includes('neuro') || d.includes('brain')) {
    return {
      key: 'neurology',
      label: deptName || 'Neurology',
      icon: Brain,
      className: 'badge-dept-neurology',
    };
  }
  if (d.includes('radio') || d.includes('x-ray') || d.includes('mri') || d.includes('imaging')) {
    return {
      key: 'radiology',
      label: deptName || 'Radiology',
      icon: Scan,
      className: 'badge-dept-radiology',
    };
  }
  if (d.includes('surg') || d.includes('operation')) {
    return {
      key: 'surgery',
      label: deptName || 'Surgery',
      icon: Scissors,
      className: 'badge-dept-surgery',
    };
  }
  if (d.includes('pediat') || d.includes('child')) {
    return {
      key: 'pediatrics',
      label: deptName || 'Pediatrics',
      icon: Baby,
      className: 'badge-dept-pediatrics',
    };
  }
  if (d.includes('emerg') || d.includes('trauma') || d.includes('er')) {
    return {
      key: 'emergency',
      label: deptName || 'Emergency',
      icon: Flame,
      className: 'badge-dept-emergency',
    };
  }
  if (d.includes('icu') || d.includes('critical') || d.includes('intensive')) {
    return {
      key: 'icu',
      label: deptName || 'ICU',
      icon: Activity,
      className: 'badge-dept-icu',
    };
  }
  if (d.includes('lab') || d.includes('patho')) {
    return {
      key: 'laboratory',
      label: deptName || 'Laboratory',
      icon: FlaskConical,
      className: 'badge-dept-laboratory',
    };
  }
  if (d.includes('pharm') || d.includes('drug')) {
    return {
      key: 'pharmacy',
      label: deptName || 'Pharmacy',
      icon: Pill,
      className: 'badge-dept-pharmacy',
    };
  }
  if (d.includes('onco') || d.includes('cancer')) {
    return {
      key: 'oncology',
      label: deptName || 'Oncology',
      icon: ShieldAlert,
      className: 'badge-dept-oncology',
    };
  }
  if (d.includes('ortho') || d.includes('bone')) {
    return {
      key: 'orthopedics',
      label: deptName || 'Orthopedics',
      icon: Bone,
      className: 'badge-dept-orthopedics',
    };
  }
  if (d.includes('derma') || d.includes('skin')) {
    return {
      key: 'dermatology',
      label: deptName || 'Dermatology',
      icon: Sun,
      className: 'badge-dept-dermatology',
    };
  }
  if (d.includes('psych') || d.includes('mental')) {
    return {
      key: 'psychiatry',
      label: deptName || 'Psychiatry',
      icon: Sparkles,
      className: 'badge-dept-psychiatry',
    };
  }
  if (d.includes('nurs')) {
    return {
      key: 'nursing',
      label: deptName || 'Nursing',
      icon: Stethoscope,
      className: 'badge-dept-nursing',
    };
  }

  // Fallback default
  return {
    key: 'general',
    label: deptName || 'General Medicine',
    icon: Building2,
    className: 'badge-dept-general',
  };
}

interface DepartmentBadgeProps {
  department?: string;
  className?: string;
  showIcon?: boolean;
}

export function DepartmentBadge({ department, className, showIcon = true }: DepartmentBadgeProps) {
  const config = getDepartmentConfig(department);
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'badge-dept font-bold uppercase tracking-wider',
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
}

export default DepartmentBadge;
