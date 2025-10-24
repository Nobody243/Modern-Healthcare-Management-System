'use client';
import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortOrder = 'asc' | 'desc';

export interface SortableHeaderProps {
  label: React.ReactNode;
  columnKey: string;
  currentSortKey: string;
  currentSortOrder: SortOrder;
  onSort: (columnKey: string) => void;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function SortableHeader({
  label,
  columnKey,
  currentSortKey,
  currentSortOrder,
  onSort,
  className,
  align = 'left',
}: SortableHeaderProps) {
  const isActive = currentSortKey === columnKey;

  const getAlignmentClass = () => {
    if (align === 'center') return 'justify-center text-center';
    if (align === 'right') return 'justify-end text-right';
    return 'justify-start text-left';
  };

  return (
    <button
      type="button"
      onClick={() => onSort(columnKey)}
      className={cn(
        'group inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-xs transition-colors select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded px-1 -mx-1',
        isActive
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground',
        getAlignmentClass(),
        className
      )}
      title={`Sort by ${typeof label === 'string' ? label : columnKey}`}
    >
      <span>{label}</span>
      <span className="shrink-0 transition-transform">
        {isActive ? (
          currentSortOrder === 'asc' ? (
            <ArrowUp className="w-3.5 h-3.5 text-primary" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-primary" />
          )
        ) : (
          <ArrowUpDown className="w-3.5 h-3.5 opacity-30 group-hover:opacity-70 transition-opacity" />
        )}
      </span>
    </button>
  );
}
