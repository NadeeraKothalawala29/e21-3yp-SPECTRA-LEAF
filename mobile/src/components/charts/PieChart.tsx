'use client';

import {
  PieChart as RPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { chartColors, tooltipStyle } from './chartTheme';

const palette = [
  chartColors.primary,
  chartColors.secondary,
  chartColors.warn,
  '#A78BFA',
  '#F472B6',
];

interface Props {
  data: Array<{ name: string; value: number }>;
  height?: number;
}

export function PieChart({ data, height = 280 }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RPieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          stroke="#111318"
          strokeWidth={2}
          isAnimationActive={false}
          label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={palette[i % palette.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#F0F2F5' }} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: chartColors.text, paddingTop: 8 }}
          iconType="square"
        />
      </RPieChart>
    </ResponsiveContainer>
  );
}
