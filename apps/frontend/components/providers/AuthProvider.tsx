'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth/auth.service';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loadUser, isAuthenticated, user } = useAuth();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    
    if (!hasLoadedRef.current && authService.isAuthenticated() && (!isAuthenticated || !user)) {
      hasLoadedRef.current = true;
      loadUser();
    }
  }, []); 

  return <>{children}</>;
}
