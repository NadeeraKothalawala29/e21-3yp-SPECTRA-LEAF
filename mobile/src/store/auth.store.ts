import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Role } from '@/types';

interface AuthStore {
  role: Role | null;
  factoryId: string;
  factoryIds: string[];
  displayName: string;
  hydrated: boolean;
  setAuth: (role: Role, factoryId: string, factoryIds?: string[]) => void;
  logout: () => void;
  setHydrated: () => void;
}

function setCookie(name: string, value: string, maxAge = 43200) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      role: null,
      factoryId: '',
      factoryIds: [],
      displayName: '',
      hydrated: false,

      setAuth: (role, factoryId, factoryIds = []) => {
        const ids = factoryIds.length > 0 ? factoryIds : [factoryId].filter(Boolean);
        setCookie('spectraleaf_role', role);
        set({ role, factoryId, factoryIds: ids });
      },

      logout: () => {
        clearCookie('spectraleaf_role');
        set({ role: null, factoryId: '', factoryIds: [], displayName: '' });
      },

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'spectraleaf-auth-v2',
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? ({} as Storage) : localStorage
      ),
      migrate: (persisted: any) => {
        // Handle old format: { user: { role, factoryId, username }, token }
        if (persisted?.user?.role) {
          return {
            role: persisted.user.role as Role,
            factoryId: persisted.user.factoryId ?? '',
            factoryIds: persisted.user.factoryId ? [persisted.user.factoryId] : [],
            displayName: persisted.user.username ?? '',
          };
        }
        return persisted;
      },
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
