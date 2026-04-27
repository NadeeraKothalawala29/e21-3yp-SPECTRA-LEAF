'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import type { Role } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

/* ─── Icons ─── */
function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

const ICONS = {
  leaf:    <Svg><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.3c1.7 7.3-5.5 17.7-8.2 17.7Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></Svg>,
  pulse:   <Svg><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></Svg>,
  list:    <Svg><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/></Svg>,
  chart:   <Svg><path d="M3 3v18h18"/><path d="M7 14v3M11 10v7M15 6v11M19 13v4"/></Svg>,
  factory: <Svg><path d="M2 20h20"/><path d="M17 20v-8l-5-4-5 4v8"/><path d="M10 20V10"/><path d="M17 20V8l3 2v10"/></Svg>,
  beaker:  <Svg><path d="M9 3h6"/><path d="M9 3v6.5L4 18a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 18l-5-8.5V3"/></Svg>,
  sensor:  <Svg><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 10v6"/><path d="m4.22 4.22 4.24 4.24m7.07 7.07 4.24 4.24"/><path d="M1 12h6m10 0h6"/><path d="m4.22 19.78 4.24-4.24m7.07-7.07 4.24-4.24"/></Svg>,
  user:    <Svg><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></Svg>,
  logout:  <Svg><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></Svg>,
  clock:   <Svg><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Svg>,
  chevronLeft: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  ),
  chevronRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  ),
};

/* ─── Role-aware nav configuration ─── */
const config: Record<Role, {
  section: string;
  items: NavItem[];
  homeBase: string;
}> = {
  OFFICER: {
    section: 'OPERATIONS',
    homeBase: '/officer',
    items: [
      { label: 'Live Dashboard', href: '/officer',         icon: ICONS.pulse   },
      { label: 'Sensors',        href: '/officer/sensors', icon: ICONS.sensor  },
      { label: 'Batches',        href: '/officer/history', icon: ICONS.beaker  },
      { label: 'Factory',        href: '/officer/factory', icon: ICONS.factory },
    ],
  },
  MANAGER: {
    section: 'MANAGEMENT',
    homeBase: '/manager',
    items: [
      { label: 'Batches',   href: '/manager',           icon: ICONS.list  },
      { label: 'Analytics', href: '/manager/analytics', icon: ICONS.chart },
    ],
  },
  GENERAL_MANAGER: {
    section: 'EXECUTIVE',
    homeBase: '/gm',
    items: [
      { label: 'Factory Overview', href: '/gm', icon: ICONS.factory },
    ],
  },
};

const roleLabel: Record<Role, string> = {
  OFFICER: 'Factory Officer',
  MANAGER: 'Factory Manager',
  GENERAL_MANAGER: 'General Manager',
};

/* ─── Live clock (HH:MM + date) ─── */
function useNow() {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);
  return now;
}

function ClockBlock({ collapsed }: { collapsed: boolean }) {
  const now = useNow();
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', weekday: 'short' });

  if (collapsed) {
    return (
      <div className="px-2 py-3 flex flex-col items-center gap-1"
        style={{ borderTop: '1px solid var(--side-border)' }}>
        <span className="text-white" title={date}>{ICONS.clock}</span>
        <span className="text-[10px] font-mono text-white tabular-nums">{time}</span>
      </div>
    );
  }
  return (
    <div className="px-4 py-3" style={{ borderTop: '1px solid var(--side-border)' }}>
      <div className="flex items-center gap-2.5">
        <span style={{ color: 'var(--side-text-muted)' }}>{ICONS.clock}</span>
        <div className="flex-1 leading-tight">
          <div className="text-[14px] font-mono font-semibold text-white tabular-nums">{time}</div>
          <div className="text-[10.5px]" style={{ color: 'var(--side-text-muted)' }}>{date}</div>
        </div>
        <span className="live-dot" />
      </div>
    </div>
  );
}

/* ─── Sidebar ─── */
export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const factoryId = useAuthStore((s) => s.factoryId);

  const [collapsed, setCollapsed] = useState(false);

  const { section, items, homeBase } = config[role];
  const profileHref = `${homeBase}/profile`;

  function handleLogout() {
    logout();
    router.push('/login');
  }

  function isActive(item: NavItem) {
    if (item.href === pathname) return true;
    if (item.href !== homeBase && pathname?.startsWith(item.href + '/')) return true;
    return false;
  }

  return (
    <div className="flex shrink-0 h-screen sticky top-0">
      {/* ── Icon rail ── */}
      <div
        className="w-[64px] flex flex-col items-center py-4 gap-1.5"
        style={{ background: 'var(--side-rail)' }}
      >
        {/* Logo */}
        <Link href={homeBase}
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-1 shrink-0"
          style={{ background: 'var(--accent-primary)' }}>
          <img src="/images/Logo.png" alt="Spectraleaf" className="w-6 h-6 object-contain" />
        </Link>

        {/* Collapse / expand toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-9 h-9 rounded-lg flex items-center justify-center mb-2 text-[var(--side-text-muted)] hover:bg-[var(--side-hover)] hover:text-white transition-colors"
        >
          {collapsed ? ICONS.chevronRight : ICONS.chevronLeft}
        </button>

        {/* Nav icons — same items as expanded panel, shown only when collapsed */}
        {collapsed && items.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                active
                  ? 'bg-[var(--side-active-bg)] text-white'
                  : 'text-[var(--side-text-muted)] hover:bg-[var(--side-hover)] hover:text-white'
              )}
            >
              {item.icon}
            </Link>
          );
        })}

        <div className="flex-1" />

        {/* Profile */}
        <Link
          href={profileHref}
          title="Profile"
          className={cn(
            'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
            pathname === profileHref
              ? 'bg-[var(--side-active-bg)] text-white'
              : 'text-[var(--side-text-muted)] hover:bg-[var(--side-hover)] hover:text-white'
          )}
        >
          {ICONS.user}
        </Link>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          title="Sign out"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--side-text-muted)] hover:bg-[var(--side-hover)] hover:text-white transition-colors"
        >
          {ICONS.logout}
        </button>
      </div>

      {/* ── Expanded panel (animated width) ── */}
      <aside
        className="flex flex-col overflow-hidden"
        style={{
          width: collapsed ? 0 : 220,
          background: 'var(--side-panel)',
          borderRight: collapsed ? 'none' : '1px solid var(--side-border)',
          transition: 'width 220ms ease',
        }}
      >
        <div className="min-w-[220px] flex flex-col h-full">
          {/* Header */}
          <div
            className="h-[64px] px-4 flex items-center shrink-0"
            style={{ borderBottom: '1px solid var(--side-border)' }}
          >
            <span className="text-[17px] font-semibold tracking-tight text-white">Dashboard</span>
          </div>

          {/* Section label */}
          <div className="px-4 pt-5 pb-2">
            <span className="text-[10px] font-semibold tracking-[0.14em]"
              style={{ color: 'var(--side-text-muted)' }}>
              {section}
            </span>
          </div>

          {/* Nav items */}
          <nav className="px-2 space-y-0.5 flex-1 overflow-y-auto">
            {items.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-[13.5px] font-medium transition-colors',
                    active
                      ? 'text-white bg-[var(--side-active-bg)]'
                      : 'text-[var(--side-text)] hover:bg-[var(--side-hover)]'
                  )}
                >
                  <span style={{ color: active ? 'white' : 'var(--side-text-muted)' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Clock */}
          <ClockBlock collapsed={false} />

          {/* User footer */}
          <div className="px-4 py-3 shrink-0"
            style={{ borderTop: '1px solid var(--side-border)' }}>
            <div className="flex items-center gap-3">
              <Link href={profileHref}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                style={{ background: 'var(--accent-primary)' }}>
                {factoryId?.slice(0, 2) ?? 'SL'}
              </Link>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-white truncate">
                  {factoryId || '—'}
                </div>
                <div className="text-[10px] truncate"
                  style={{ color: 'var(--side-text-muted)' }}>
                  {roleLabel[role]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
