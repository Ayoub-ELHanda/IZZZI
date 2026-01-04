'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth/auth.service';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loadUser, isAuthenticated, user } = useAuth();

  useEffect(() => {
    // Always try to load user if token exists, even if isAuthenticated is false initially
    // This handles the case where Zustand hasn't hydrated yet
    if (authService.isAuthenticated() && (!isAuthenticated || !user)) {
      loadUser();
    }
  }, [isAuthenticated, user, loadUser]);

  return <>{children}</>;
}
