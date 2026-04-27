'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import type { Role } from '@/types';

const roleLabel: Record<Role, string> = {
  OFFICER: 'Factory Officer',
  MANAGER: 'Factory Manager',
  GENERAL_MANAGER: 'General Manager',
};

const roleTone: Record<Role, string> = {
  OFFICER: 'bg-accent-primary-soft text-[#166534]',
  MANAGER: 'bg-accent-secondary-soft text-[#1D4ED8]',
  GENERAL_MANAGER: 'bg-accent-warn-soft text-[#B45309]',
};

export function Header() {
  const router = useRouter();
  const role = useAuthStore((s) => s.role);
  const factoryId = useAuthStore((s) => s.factoryId);
  const logout = useAuthStore((s) => s.logout);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  if (!role) return null;

  return (
    <header className="h-12 bg-surface border-b border-border px-7 flex items-center justify-end gap-3">
      <div className="text-[12px] text-text-muted">
        Factory <span className="font-mono font-semibold text-text-primary">{factoryId || '—'}</span>
      </div>
      <span className="w-px h-4 bg-border" />
      <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-medium rounded-full ${roleTone[role]}`}>
        {roleLabel[role]}
      </span>
      <button
        onClick={handleLogout}
        className="text-[12px] text-text-secondary hover:text-accent-danger transition-colors px-2 py-1 rounded-md hover:bg-subtle"
      >
        Sign out
      </button>
    </header>
  );
}
