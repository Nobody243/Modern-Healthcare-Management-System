'use client';

import React from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// BASE SHIMMER BOX
// ============================================================================
export function SkeletonBox({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg bg-slate-800/60 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-slate-700/30 before:to-transparent ${className}`}
    />
  );
}

// ============================================================================
// IN-TABLE ROWS SKELETON (FOR TBODY DURING FETCH)
// ============================================================================
export function TableRowsSkeleton({
  columns = 7,
  rows = 5,
}: {
  columns?: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="border-b border-slate-800/40 animate-pulse">
          {Array.from({ length: columns }).map((_, cIdx) => (
            <td key={cIdx} className="py-4 px-4">
              <SkeletonBox
                className={`h-4 ${
                  cIdx === 0
                    ? 'w-20'
                    : cIdx === 1
                    ? 'w-40'
                    : cIdx === columns - 1
                    ? 'w-20 ml-auto'
                    : 'w-24'
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ============================================================================
// TABLE LOADING SKELETON (FOR DIRECTORY & MANAGEMENT PAGES)
// ============================================================================
export function TableLoadingSkeleton({
  columns = 6,
  rows = 6,
  title = 'Loading Clinical Records...',
  subtitle = 'Retrieving real-time data from Oracle 19c database',
}: {
  columns?: number;
  rows?: number;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <SkeletonBox className="h-8 w-64 rounded-xl" />
            <SkeletonBox className="h-6 w-24 rounded-full" />
          </div>
          <SkeletonBox className="h-4 w-96 max-w-full" />
        </div>
        <SkeletonBox className="h-10 w-44 rounded-xl" />
      </div>

      {/* Metric KPI Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <SkeletonBox className="h-4 w-28" />
              <SkeletonBox className="h-9 w-9 rounded-xl" />
            </div>
            <SkeletonBox className="h-8 w-20" />
            <SkeletonBox className="h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4">
        <SkeletonBox className="h-10 flex-1 rounded-xl" />
        <SkeletonBox className="h-10 w-32 rounded-xl hidden sm:block" />
      </div>

      {/* Main Table Skeleton Container */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-2xl overflow-hidden">
        {/* Top Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 animate-pulse" />

        {/* Table Header Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono text-cyan-300 font-semibold uppercase tracking-wider">
              {title}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline-block">
            {subtitle}
          </span>
        </div>

        {/* Table Rows Skeleton */}
        <div className="p-4 space-y-3.5">
          {Array.from({ length: rows }).map((_, rIdx) => (
            <div
              key={rIdx}
              className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 flex-1">
                <SkeletonBox className="h-9 w-9 rounded-xl shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <SkeletonBox className={`h-4 ${rIdx % 2 === 0 ? 'w-48' : 'w-36'}`} />
                  <SkeletonBox className="h-3 w-28" />
                </div>
              </div>

              <div className="hidden md:flex items-center gap-8 flex-1 justify-around">
                <SkeletonBox className="h-4 w-24" />
                <SkeletonBox className="h-4 w-28" />
                <SkeletonBox className="h-6 w-20 rounded-full" />
              </div>

              <div className="flex items-center gap-2">
                <SkeletonBox className="h-8 w-8 rounded-lg" />
                <SkeletonBox className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CARDS GRID SKELETON (FOR SURGERIES, LABS, ASSETS, EQUIPMENT)
// ============================================================================
export function CardsLoadingSkeleton({
  count = 6,
  title = 'Loading Diagnostic Modules...',
}: {
  count?: number;
  title?: string;
}) {
  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <SkeletonBox className="h-8 w-56 rounded-xl" />
            <SkeletonBox className="h-6 w-20 rounded-full" />
          </div>
          <SkeletonBox className="h-4 w-80" />
        </div>
        <SkeletonBox className="h-10 w-40 rounded-xl" />
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SkeletonBox className="h-10 w-10 rounded-xl" />
                <div className="space-y-1">
                  <SkeletonBox className="h-4 w-32" />
                  <SkeletonBox className="h-3 w-20" />
                </div>
              </div>
              <SkeletonBox className="h-6 w-16 rounded-full" />
            </div>

            <SkeletonBox className="h-16 w-full rounded-xl" />

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <SkeletonBox className="h-4 w-28" />
              <SkeletonBox className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// DASHBOARD SKELETON (FOR ADMIN, DOCTOR & PATIENT DASHBOARDS)
// ============================================================================
export function DashboardLoadingSkeleton({
  portalName = 'Clinical Workspace',
}: {
  portalName?: string;
}) {
  return (
    <div className="space-y-6 animate-fade-in w-full">
      {/* Top Banner Skeleton */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-950 to-slate-950 border border-slate-800 space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            {portalName} // Synchronizing Telemetry...
          </span>
        </div>
        <SkeletonBox className="h-8 w-72 rounded-xl" />
        <SkeletonBox className="h-4 w-96 max-w-full" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3"
          >
            <div className="flex items-center justify-between">
              <SkeletonBox className="h-4 w-24" />
              <SkeletonBox className="h-9 w-9 rounded-xl" />
            </div>
            <SkeletonBox className="h-8 w-16" />
            <SkeletonBox className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* 2-Column Dashboard Charts / Activity Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <SkeletonBox className="h-5 w-48" />
            <SkeletonBox className="h-8 w-28 rounded-lg" />
          </div>
          <SkeletonBox className="h-64 w-full rounded-xl" />
        </div>

        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <SkeletonBox className="h-5 w-36" />
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                <SkeletonBox className="h-8 w-8 rounded-lg shrink-0" />
                <div className="space-y-1 flex-1">
                  <SkeletonBox className="h-3.5 w-32" />
                  <SkeletonBox className="h-2.5 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DEFAULT FULL PORTAL ROUTE SKELETON
// ============================================================================
export default function PortalLoadingSkeleton() {
  return <TableLoadingSkeleton />;
}
