'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth/auth.service';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loadUser, isAuthenticated, user } = useAuth();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Only load user once on mount if needed
    if (!hasLoadedRef.current && authService.isAuthenticated() && (!isAuthenticated || !user)) {
      hasLoadedRef.current = true;
      loadUser();
    }
  }, []); // Empty dependency array - only run once on mount

  return <>{children}</>;
}
