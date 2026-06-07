'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface PerfTile {
  label: string;
  sub?: string;
  value: ReactNode;
  delta?: { value: string; direction?: 'up' | 'down' | 'flat'; tone?: 'positive' | 'negative' };
  accentColor?: string;
}

interface Props {
  title: string;
  description?: string;
  tiles: PerfTile[];
  right?: ReactNode;
}

export function PerfSummary({ title, description, tiles, right }: Props) {
  return (
    <div className="bg-elevated border border-border rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="text-[16px] font-semibold text-text-primary">{title}</div>
          {description && (
            <div className="text-[13px] text-text-muted mt-1">{description}</div>
          )}
        </div>
        {right}
      </div>

      <div className={cn(
        'grid gap-x-8 gap-y-5',
        tiles.length <= 3
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      )}>
        {tiles.map((t, i) => (
          <Tile key={i} tile={t} />
        ))}
      </div>
    </div>
  );
}

function Tile({ tile }: { tile: PerfTile }) {
  const accent = tile.accentColor ?? 'var(--accent-primary)';
  const tonePositive = tile.delta?.tone === 'positive';
  const toneNegative = tile.delta?.tone === 'negative';
  const arrow =
    tile.delta?.direction === 'up' ? '↗' :
    tile.delta?.direction === 'down' ? '↘' : '→';

  return (
    <div className="flex gap-3">
      <div className="w-[3px] rounded-full mt-1" style={{ background: accent }} />
      <div className="flex-1">
        <div className="text-[13.5px] font-semibold text-text-primary leading-tight">
          {tile.label}
        </div>
        {tile.sub && (
          <div className="text-[12px] text-text-muted mt-0.5">{tile.sub}</div>
        )}
        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
          <div className="font-display text-[28px] tabular leading-none text-text-primary">
            {tile.value}
          </div>
          {tile.delta && (
            <span
              className={cn(
                'text-[13px] font-medium tabular',
                tonePositive && 'text-[#16A34A]',
                toneNegative && 'text-[#DC2626]',
                !tonePositive && !toneNegative && 'text-text-muted'
              )}
            >
              {tile.delta.value} {arrow}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
