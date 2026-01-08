
'use client';

import { useState, useEffect, useRef } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/entities';
import { authService } from '@/services/auth/auth.service';
import { LoginDto, RegisterDto } from '@/types/dto';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.registerAdmin(data as any);
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Registration failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      loadUser: async () => {
        if (!authService.isAuthenticated()) {
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authService.getProfile();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export function useAuth() {
  const store = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    
    if (!hasCheckedRef.current && authService.isAuthenticated() && !store.isAuthenticated) {
      hasCheckedRef.current = true;
      store.loadUser();
    }
  }, []); 

  if (!isMounted) {
    
    let initialAuth = false;
    let initialUser = null;
    if (typeof window !== 'undefined') {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          if (parsed.state) {
            initialAuth = parsed.state.isAuthenticated === true;
            initialUser = parsed.state.user || null;
          }
        }
        
        if (!initialAuth && authService.isAuthenticated()) {
          initialAuth = true;
        }
      } catch (e) {
        
      }
    }

    return {
      user: initialUser,
      isAuthenticated: initialAuth,
      isLoading: true,
      error: null,
      login: store.login,
      register: store.register,
      logout: store.logout,
      loadUser: store.loadUser,
      clearError: store.clearError,
    };
  }

  return store;
}
