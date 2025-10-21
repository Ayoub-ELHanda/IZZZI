// Custom authentication hook
'use client';

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
  
  // Actions
  login: (credentials: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
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
            user: response.data.user,
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
          const response = await authService.register(data);
          set({
            user: response.data.user,
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
          // Even if logout fails on server, clear local state
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
          const user = await authService.getCurrentUser();
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

