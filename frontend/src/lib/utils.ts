import { clsx, type ClassValue } from 'clsx';
import { format, formatDistanceStrict } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function fmtDate(iso?: string | null) {
  if (!iso) return '—';
  try {
    return format(new Date(iso), 'MMM d, yyyy HH:mm');
  } catch {
    return iso;
  }
}

export function fmtShortDate(iso?: string | null) {
  if (!iso) return '—';
  try {
    return format(new Date(iso), 'MMM d');
  } catch {
    return iso;
  }
}

export function fmtDuration(from?: string, to?: string) {
  if (!from) return '—';
  const end = to ? new Date(to) : new Date();
  try {
    return formatDistanceStrict(end, new Date(from));
  } catch {
    return '—';
  }
}

export function fmtCurrency(value?: number | string | null) {
  if (value === null || value === undefined || value === '') return '—';
  const num = Number(value);
  if (!Number.isFinite(num)) return '—';
  const formatted = new Intl.NumberFormat('en-LK', {
    maximumFractionDigits: 0,
  }).format(num);
  return `LKR ${formatted}`;
}

export function fmtNumber(v: number, digits = 1) {
  return v.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
