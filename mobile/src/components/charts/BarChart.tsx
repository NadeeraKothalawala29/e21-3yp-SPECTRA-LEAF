'use client';

import {
  BarChart as RBarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { chartColors, tooltipStyle } from './chartTheme';

interface Props {
  data: Array<Record<string, unknown>>;
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  xTickFormatter?: (v: unknown) => string;
  yTickFormatter?: (v: unknown) => string;
  alternateColor?: boolean;
}

export function BarChart({
  data,
  xKey,
  yKey,
  color = chartColors.primary,
  height = 260,
  xTickFormatter,
  yTickFormatter,
  alternateColor = false,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={chartColors.grid} vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: chartColors.text, fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: chartColors.grid }}
          tickFormatter={xTickFormatter}
        />
        <YAxis
          tick={{ fill: chartColors.text, fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: chartColors.grid }}
          tickFormatter={yTickFormatter}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          labelStyle={{ color: '#F0F2F5' }}
        />
        <Bar dataKey={yKey} fill={color} isAnimationActive={false}>
          {alternateColor &&
            data.map((_, i) => (
              <Cell key={i} fill={i % 2 === 0 ? chartColors.primary : chartColors.secondary} />
            ))}
        </Bar>
      </RBarChart>
    </ResponsiveContainer>
  );
}
