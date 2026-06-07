'use client';

import { create } from 'zustand';
import type { Role } from '@/types';

interface AuthState {
  role: Role | null;
  factoryId: string;
  factoryIds: string[];
  displayName: string;
  hydrated: boolean;
  setAuth: (role: Role, factoryId: string, factoryIds?: string[]) => void;
  logout: () => void;
  hydrate: () => void;
}

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=2592000; SameSite=Lax`;
}

function clearCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

function readCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const prefix = `${name}=`;
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  factoryId: '',
  factoryIds: [],
  displayName: '',
  hydrated: false,
  setAuth: (role, factoryId, factoryIds = [factoryId]) => {
    const ids = factoryIds.length > 0 ? factoryIds : [factoryId].filter(Boolean);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        'spectraleaf-auth',
        JSON.stringify({ role, factoryId, factoryIds: ids })
      );
      setCookie('spectraleaf_role', role);
      setCookie('spectraleaf_factory_id', factoryId);
      setCookie('spectraleaf_factory_ids', JSON.stringify(ids));
    }
    set({ role, factoryId, factoryIds: ids, hydrated: true });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('spectraleaf-auth');
      window.localStorage.removeItem('spectraleaf-auth-v2');
      clearCookie('spectraleaf_role');
      clearCookie('spectraleaf_factory_id');
      clearCookie('spectraleaf_factory_ids');
    }
    set({ role: null, factoryId: '', factoryIds: [], displayName: '', hydrated: true });
  },
  hydrate: () => {
    if (typeof window === 'undefined') {
      set({ hydrated: true });
      return;
    }

    const raw = window.localStorage.getItem('spectraleaf-auth');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<AuthState>;
        const factoryId = parsed.factoryId ?? '';
        set({
          role: parsed.role ?? null,
          factoryId,
          factoryIds: parsed.factoryIds?.length ? parsed.factoryIds : [factoryId].filter(Boolean),
          displayName: parsed.displayName ?? '',
          hydrated: true,
        });
        return;
      } catch {}
    }

    const role = readCookie('spectraleaf_role') as Role | null;
    const factoryId = readCookie('spectraleaf_factory_id') ?? '';
    const rawFactoryIds = readCookie('spectraleaf_factory_ids');
    let factoryIds = factoryId ? [factoryId] : [];
    if (rawFactoryIds) {
      try {
        const parsed = JSON.parse(rawFactoryIds);
        if (Array.isArray(parsed)) factoryIds = parsed;
      } catch {}
    }
    set({ role, factoryId, factoryIds, hydrated: true });
  },
}));
