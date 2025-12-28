// Header component
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { routes } from '@/config/routes';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/assets/Logo';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={routes.home} className="flex items-center">
            <Logo className="h-12 w-auto" />
          </Link>

          {/* Right side navigation */}
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href={routes.dashboard}
                  className="text-gray-800 hover:text-gray-600 transition-colors text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href={routes.classes.list}
                  className="text-gray-800 hover:text-gray-600 transition-colors text-sm font-medium"
                >
                  Classes
                </Link>
                <Link
                  href={routes.subjects.list}
                  className="text-gray-800 hover:text-gray-600 transition-colors text-sm font-medium"
                >
                  Matières
                </Link>
                <span className="text-sm text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link
                  href={routes.pricing}
                  className="text-gray-800 hover:text-gray-600 transition-colors text-sm font-medium"
                >
                  Nos tarifs
                </Link>
                <Link href={routes.auth.register}>
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                    S'inscrire
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </Link>
                <Link
                  href={routes.auth.login}
                  className="text-gray-800 hover:text-gray-600 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  Se connecter
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}



