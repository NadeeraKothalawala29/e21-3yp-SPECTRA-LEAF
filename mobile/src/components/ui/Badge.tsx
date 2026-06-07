'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'primary' | 'warn' | 'danger' | 'info' | 'live';

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const colors: Record<Tone, string> = {
    neutral: 'bg-subtle text-text-secondary',
    primary: 'bg-accent-primary-soft text-[#166534]',
    warn: 'bg-accent-warn-soft text-[#B45309]',
    danger: 'bg-accent-danger-soft text-[#B91C1C]',
    info: 'bg-accent-secondary-soft text-[#1D4ED8]',
    live: 'bg-accent-primary-soft text-[#166534]',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium rounded-full',
        colors[tone],
        className
      )}
    >
      {tone === 'live' && <span className="live-dot" />}
      {children}
    </span>
  );
}
