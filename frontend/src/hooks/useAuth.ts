'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import type { Role } from '@/types';

const roleHomes: Record<Role, string> = {
  OFFICER: '/officer',
  MANAGER: '/manager',
  GENERAL_MANAGER: '/gm',
};

export function useAuth(requiredRole?: Role) {
  const router = useRouter();
  const role = useAuthStore((s) => s.role);
  const hydrated = useAuthStore((s) => s.hydrated);
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    if (!role) {
      if (typeof document !== 'undefined') {
        document.cookie = 'spectraleaf_role=; path=/; max-age=0';
      }
      router.replace('/login');
      return;
    }
    if (requiredRole && role !== requiredRole) {
      router.replace(roleHomes[role]);
    }
  }, [hydrated, requiredRole, role, router]);

  return { role, hydrated };
}
