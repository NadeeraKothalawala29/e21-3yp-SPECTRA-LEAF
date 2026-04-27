'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  startedAt: string;
  durationMs: number;
  onComplete?: () => void;
}

export function CountdownTimer({ startedAt, durationMs, onComplete }: Props) {
  const target = new Date(startedAt).getTime() + durationMs;
  const [remaining, setRemaining] = useState(() => Math.max(0, target - Date.now()));

  useEffect(() => {
    const id = setInterval(() => {
      const rem = Math.max(0, target - Date.now());
      setRemaining(rem);
      if (rem === 0) {
        clearInterval(id);
        onComplete?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target, onComplete]);

  const mm = Math.floor(remaining / 60000);
  const ss = Math.floor((remaining % 60000) / 1000);
  const done = remaining === 0;

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          'font-display tabular text-2xl tracking-tight',
          done ? 'text-accent-primary' : 'text-accent-warn'
        )}
      >
        {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
      </div>
      <div className="text-[10px] tracking-widest uppercase text-text-muted">
        {done ? 'Ready to Start' : 'Until Ready'}
      </div>
    </div>
  );
}
