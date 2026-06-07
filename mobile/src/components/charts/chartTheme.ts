export const chartColors = {
  primary: '#15803D',
  secondary: '#3B82F6',
  warn: '#F59E0B',
  danger: '#EF4444',
  grid: '#E2E8F0',
  axis: '#94A3B8',
  text: '#64748B',
  tooltipBg: '#FFFFFF',
  tooltipBorder: '#E2E8F0',
};

export const tooltipStyle = {
  backgroundColor: chartColors.tooltipBg,
  border: `1px solid ${chartColors.tooltipBorder}`,
  borderRadius: 10,
  padding: '10px 12px',
  color: '#0F172A',
  fontSize: 12,
  fontFamily: 'Inter, system-ui, sans-serif',
  boxShadow: '0 12px 32px rgba(15,23,42,0.10)',
};

export const axisStyle = {
  stroke: chartColors.axis,
  fontSize: 11,
  fontFamily: 'Inter, system-ui, sans-serif',
};
