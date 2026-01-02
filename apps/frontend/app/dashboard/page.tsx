'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import { authService } from '@/services/auth/auth.service';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        router.push(routes.auth.login);
        return;
      }

      // No redirect needed - all users can access dashboard
      try {
        await authService.getProfile();
      } catch (error) {
        console.error('Error fetching profile:', error);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Classes Card */}
          <Link href={routes.classes.list}>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Mes Classes</h2>
              <p className="text-gray-600">Gérer vos classes</p>
            </div>
          </Link>

          {/* Subjects Card */}
          <Link href={routes.subjects.list}>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Matières</h2>
              <p className="text-gray-600">Gérer vos matières</p>
            </div>
          </Link>

          {/* Questionnaires Card */}
          <Link href={routes.questionnaires.list}>
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Questionnaires</h2>
              <p className="text-gray-600">Gérer vos questionnaires</p>
            </div>
          </Link>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Bienvenue, {user?.firstName} {user?.lastName}!</h2>
          <p className="text-gray-600">
            Vous êtes connecté en tant que {user?.role === 'RESPONSABLE_PEDAGOGIQUE' ? 'Responsable Pédagogique' : 'Utilisateur'}.
          </p>
        </div>
      </div>
    </div>
  );
}

