'use client';

import {
  LineChart as RLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { chartColors, tooltipStyle } from './chartTheme';

export interface LineSeries {
  dataKey: string;
  name: string;
  color?: string;
}

interface Props {
  data: Array<Record<string, unknown>>;
  xKey: string;
  series: LineSeries[];
  height?: number;
  showLegend?: boolean;
  xTickFormatter?: (v: unknown) => string;
  yTickFormatter?: (v: unknown) => string;
}

export function LineChart({
  data,
  xKey,
  series,
  height = 280,
  showLegend = false,
  xTickFormatter,
  yTickFormatter,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RLineChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={chartColors.grid} strokeDasharray="0" vertical={false} />
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
          cursor={{ stroke: chartColors.axis, strokeDasharray: '3 3' }}
          labelStyle={{ color: '#F0F2F5' }}
        />
        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: 11, color: chartColors.text, paddingTop: 8 }}
            iconType="square"
          />
        )}
        {series.map((s, i) => (
          <Line
            key={s.dataKey}
            type="monotone"
            dataKey={s.dataKey}
            name={s.name}
            stroke={s.color ?? (i === 0 ? chartColors.primary : chartColors.secondary)}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: s.color ?? chartColors.primary }}
            isAnimationActive={false}
          />
        ))}
      </RLineChart>
    </ResponsiveContainer>
  );
}
