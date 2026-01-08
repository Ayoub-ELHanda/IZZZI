'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { routes } from '@/config/routes';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      // Save token to localStorage
      localStorage.setItem('auth_token', token);
      // Fetch user profile to check role
      const fetchUserAndRedirect = async () => {
        try {
          const { authService } = await import('@/services/auth/auth.service');
          const user = await authService.getProfile();
          // Redirect based on user role
          if (user?.role === 'SUPER_ADMIN') {
            router.push(routes.superAdmin);
          } else if (user?.role === 'ADMIN') {
            router.push(routes.account.profile);
          } else {
            router.push(routes.dashboard);
          }
        } catch (error) {
          // If fetching profile fails, redirect to dashboard as fallback
          router.push(routes.dashboard);
        }
      };
      fetchUserAndRedirect();
    } else if (error) {
      // Redirect to login with error message
      router.push(`${routes.auth.login}?error=${encodeURIComponent(error)}`);
    } else {
      // No token or error, redirect to login
      router.push(routes.auth.login);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Connexion en cours...</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
          <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}