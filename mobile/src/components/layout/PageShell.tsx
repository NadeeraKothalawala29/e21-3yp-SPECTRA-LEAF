'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface TabItem {
  key: string;
  label: string;
}

interface Props {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  actions?: ReactNode;
  children: ReactNode;
}

export function PageShell({
  breadcrumbs,
  title,
  tabs,
  activeTab,
  onTabChange,
  actions,
  children,
}: Props) {
  return (
    <div className="flex flex-col min-h-full">
      {/* Breadcrumb bar */}
      <div className="px-7 pt-5 pb-3">
        <nav className="flex items-center gap-1.5 text-[13px] text-text-secondary">
          {breadcrumbs.map((b, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-text-muted">/</span>}
              <span className="inline-flex items-center gap-1.5">
                {b.icon}
                <span className={cn(i === breadcrumbs.length - 1 && 'text-text-primary font-medium')}>
                  {b.label}
                </span>
              </span>
              {i < breadcrumbs.length - 1 && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Title */}
      <div className="px-7">
        <h1 className="text-[26px] font-bold tracking-tight text-text-primary">{title}</h1>
      </div>

      {/* Tab + actions row */}
      {(tabs || actions) && (
        <div className="px-7 pt-4 pb-5 flex flex-wrap items-center justify-between gap-3">
          {tabs ? (
            <div className="inline-flex items-center bg-elevated border border-border rounded-lg p-1 shadow-sm">
              {tabs.map((t) => {
                const active = t.key === activeTab;
                return (
                  <button
                    key={t.key}
                    onClick={() => onTabChange?.(t.key)}
                    className={cn(
                      'px-4 h-8 rounded-md text-[13px] font-medium transition-all',
                      active
                        ? 'bg-base text-text-primary shadow-sm'
                        : 'text-text-muted hover:text-text-primary'
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          ) : <div />}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Body */}
      <div className="px-7 pb-8 space-y-5 flex-1">{children}</div>
    </div>
  );
}

/* ───────────── Date range + Filter buttons (visual only by default) ───────────── */

export function DateRangeButton({ children }: { children: ReactNode }) {
  return (
    <button className="inline-flex items-center gap-2 h-9 px-3 bg-elevated border border-border rounded-md text-[13px] text-text-primary hover:bg-subtle transition-colors shadow-sm">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
      {children}
    </button>
  );
}

export function FilterButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 h-9 px-3 bg-elevated border border-border rounded-md text-[13px] text-text-primary hover:bg-subtle transition-colors shadow-sm">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
        <path d="M3 6h18M7 12h10M10 18h4" />
      </svg>
      Filter
    </button>
  );
}
