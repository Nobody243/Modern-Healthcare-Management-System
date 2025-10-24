'use client';
import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Activity, 
  Wrench, 
  ShieldCheck 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatusConfig {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  className: string;
  dotColor: string;
}

export function getStatusConfig(status?: string): StatusConfig {
  const s = (status || '').toLowerCase().trim();

  // 1. ACTIVE / FUNCTIONING / APPROVED / NORMAL / PAID / DELIVERED / DISCHARGED
  if (
    s.includes('active') || 
    s.includes('function') || 
    s.includes('approv') || 
    s.includes('normal') || 
    s.includes('paid') || 
    s.includes('delivered') || 
    s.includes('discharged')
  ) {
    return {
      key: 'success',
      label: status || 'Active',
      icon: CheckCircle2,
      className: 'badge-subaction-success',
      dotColor: 'bg-emerald-500',
    };
  }

  // 2. COMPLETED / SUCCESSFUL / VERIFIED / FINISHED
  if (
    s.includes('complete') || 
    s.includes('success') || 
    s.includes('verif') || 
    s.includes('finish')
  ) {
    return {
      key: 'completed',
      label: status || 'Completed',
      icon: ShieldCheck,
      className: 'badge-subaction-completed',
      dotColor: 'bg-cyan-500',
    };
  }

  // 3. SCHEDULED / IN PROGRESS / PENDING / ON HOLD / ORDERED / AWAITING
  if (
    s.includes('schedul') || 
    s.includes('progress') || 
    s.includes('pend') || 
    s.includes('hold') || 
    s.includes('order') || 
    s.includes('await')
  ) {
    return {
      key: 'warning',
      label: status || 'Scheduled',
      icon: Clock,
      className: 'badge-subaction-warning',
      dotColor: 'bg-amber-500',
    };
  }

  // 4. CANCELLED / EXPIRED / BROKEN / RETIRED / CRITICAL / INACTIVE / FAILED
  if (
    s.includes('cancel') || 
    s.includes('expir') || 
    s.includes('broke') || 
    s.includes('retir') || 
    s.includes('crit') || 
    s.includes('inact') || 
    s.includes('fail')
  ) {
    return {
      key: 'danger',
      label: status || 'Cancelled',
      icon: XCircle,
      className: 'badge-subaction-danger',
      dotColor: 'bg-rose-500',
    };
  }

  // 5. MAINTENANCE / CALIBRATION / TESTING
  if (
    s.includes('maint') || 
    s.includes('calib') || 
    s.includes('test')
  ) {
    return {
      key: 'maintenance',
      label: status || 'Maintenance',
      icon: Wrench,
      className: 'badge-subaction-purple',
      dotColor: 'bg-purple-500',
    };
  }

  // Default Info
  return {
    key: 'info',
    label: status || 'Info',
    icon: Activity,
    className: 'badge-subaction-info',
    dotColor: 'bg-cyan-500',
  };
}

interface StatusBadgeProps {
  status?: string;
  className?: string;
  showIcon?: boolean;
  showDot?: boolean;
}

export function StatusBadge({ status, className, showIcon = false, showDot = true }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'badge-subaction font-bold',
        config.className,
        className
      )}
    >
      {showDot && (
        <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', config.dotColor)} />
          <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', config.dotColor)} />
        </span>
      )}
      {showIcon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{config.label}</span>
    </span>
  );
}

export default StatusBadge;
