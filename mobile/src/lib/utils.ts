import { format, formatDistanceStrict } from 'date-fns';

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function fmtDate(iso?: string) {
  if (!iso) return '—';
  try {
    return format(new Date(iso), 'MMM d, yyyy HH:mm');
  } catch {
    return iso;
  }
}

export function fmtShortDate(iso?: string) {
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

export function fmtCurrency(v?: number) {
  if (v === undefined || v === null) return '—';
  return `$${v.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function fmtNumber(v: number, digits = 1) {
  return v.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
