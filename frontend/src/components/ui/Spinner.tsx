'use client';

import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'inline-block w-4 h-4 border-2 border-border border-t-accent-primary rounded-full animate-spin',
        className
      )}
    />
  );
}

export function SkeletonRow({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="border-b border-border last:border-b-0">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3.5 bg-subtle animate-pulse rounded w-full max-w-[180px]" />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn('bg-subtle animate-pulse rounded', className)} />;
}
