// Mobile palette mirrors the web officer dashboard tokens defined in
// frontend/src/app/globals.css so the two apps feel like one product.
export const theme = {
  colors: {
    // Surfaces
    background: '#F8FAF9',   // --bg-base
    surface: '#FFFFFF',      // --bg-surface / --bg-elevated
    subtle: '#F1F5F4',       // --bg-subtle (chips, hover)

    // Borders
    border: '#E2E8F0',
    borderActive: '#CBD5E1',

    // Primary (green-600 family)
    primary: '#15803D',
    primaryDark: '#166534',
    primaryLight: '#22C55E',
    primarySoft: '#F0FDF4',

    // Secondary (blue-500)
    accent: '#3B82F6',
    accentSoft: '#EFF6FF',

    // Text
    text: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',

    // Status
    danger: '#EF4444',
    dangerSoft: '#FEF2F2',
    warning: '#F59E0B',
    warningSoft: '#FFFBEB',
    success: '#15803D',
    info: '#3B82F6',

    // Dark surfaces (used by the floating active nav bubble + dark sidebar look)
    dark: '#0B0D11',
    darkSoft: '#15181E',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    pill: 999,
  },
  font: {
    h1: 26,
    h2: 20,
    h3: 17,
    body: 15,
    small: 13,
    tiny: 11,
  },
};

export type Theme = typeof theme;
