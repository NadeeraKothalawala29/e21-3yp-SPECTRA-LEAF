'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import type { Role } from '@/types';

export function useAuth(required?: Role) {
  const router = useRouter();
  const role = useAuthStore((s) => s.role);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    if (!role) {
      // Clear any stale cookie so middleware doesn't loop back here
      if (typeof document !== 'undefined') {
        document.cookie = 'spectraleaf_role=; path=/; max-age=0';
      }
      router.replace('/login');
      return;
    }
    if (required && role !== required) {
      const home: Record<Role, string> = {
        OFFICER: '/officer',
        MANAGER: '/manager',
        GENERAL_MANAGER: '/gm',
      };
      router.replace(home[role]);
    }
  }, [role, hydrated, required, router]);

  return { role, hydrated };
}
