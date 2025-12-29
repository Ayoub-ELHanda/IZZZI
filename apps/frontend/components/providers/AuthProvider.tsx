'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loadUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      loadUser();
    }
  }, []);

  return <>{children}</>;
}
