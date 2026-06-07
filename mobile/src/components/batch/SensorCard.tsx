'use client';

interface Props {
  label: string;
  value: number | string | null;
  unit: string;
  trend: number[];
  color?: string;
  precision?: number;
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) {
    return <svg width={100} height={30} />;
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 100;
  const H = 30;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W;
      const y = H - ((v - min) / range) * H;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const areaPts = `0,${H} ${pts} ${W},${H}`;

  return (
    <svg width={W} height={H} className="overflow-visible">
      <polygon points={areaPts} fill={color} opacity={0.1} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.75} />
      <circle
        cx={W}
        cy={H - ((values[values.length - 1] - min) / range) * H}
        r={2.5}
        fill={color}
      />
    </svg>
  );
}

function trendDirection(values: number[]): 'up' | 'down' | 'flat' {
  if (values.length < 2) return 'flat';
  const first = values[0];
  const last = values[values.length - 1];
  const diff = last - first;
  const pct = Math.abs(diff) / Math.max(Math.abs(first), 1e-9);
  if (pct < 0.01) return 'flat';
  return diff > 0 ? 'up' : 'down';
}

export function SensorCard({
  label,
  value,
  unit,
  trend,
  color = 'var(--accent-primary)',
  precision = 1,
}: Props) {
  const dir = trendDirection(trend);
  const dirClass =
    dir === 'up' ? 'text-[#16A34A]' : dir === 'down' ? 'text-[#1D4ED8]' : 'text-text-muted';
  const displayValue =
    value === null ? '—' : typeof value === 'number' ? value.toFixed(precision) : value;

  return (
    <div className="bg-elevated border border-border rounded-lg shadow-sm p-5 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="eyebrow">{label}</div>
        <div className={`flex items-center gap-1 text-[11px] font-medium ${dirClass}`}>
          {dir === 'up' && <span>▲</span>}
          {dir === 'down' && <span>▼</span>}
          {dir === 'flat' && <span>—</span>}
          <span className="capitalize">{dir}</span>
        </div>
      </div>

      <div className="flex items-end gap-2 mb-1">
        <div
          className="font-display tabular leading-none"
          style={{ fontSize: '2.2rem', color: 'var(--text-primary)' }}
        >
          {displayValue}
        </div>
        <div className="text-text-muted text-xs pb-1 font-medium">{unit}</div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-[11px] text-text-muted">
          {trend.length > 0 ? `Last ${trend.length} samples` : 'No samples yet'}
        </div>
        <Sparkline values={trend} color={color} />
      </div>
    </div>
  );
}
