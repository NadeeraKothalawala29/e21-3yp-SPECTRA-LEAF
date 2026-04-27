'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('border border-border rounded-lg overflow-x-auto bg-elevated shadow-sm', className)}>
      <table className="w-full text-[13px] border-collapse">{children}</table>
    </div>
  );
}

export function Thead({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-base">
      <tr className="text-left text-[11px] tracking-wider uppercase text-text-muted">
        {children}
      </tr>
    </thead>
  );
}

export function Th({
  children,
  onClick,
  active,
  dir,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  dir?: 'asc' | 'desc';
  className?: string;
}) {
  return (
    <th
      onClick={onClick}
      className={cn(
        'px-4 py-3 font-semibold border-b border-border',
        onClick && 'cursor-pointer select-none hover:text-text-primary',
        active && 'text-accent-primary',
        className
      )}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {active && <span className="text-[8px]">{dir === 'asc' ? '▲' : '▼'}</span>}
      </span>
    </th>
  );
}

export function Tr({
  children,
  onClick,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'row-alt border-b border-border last:border-b-0 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function Td({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void;
}) {
  return (
    <td onClick={onClick} className={cn('px-4 py-3 text-text-primary', className)}>
      {children}
    </td>
  );
}
