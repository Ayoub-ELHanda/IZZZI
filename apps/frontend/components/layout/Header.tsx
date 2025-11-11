// Header component
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { routes } from '@/config/routes';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={routes.home} className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">IZZZI</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  href={routes.dashboard}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href={routes.classes.list}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Classes
                </Link>
                <Link
                  href={routes.subjects.list}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Matières
                </Link>
                <Link
                  href={routes.account.profile}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Mon compte
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={routes.home}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Accueil
                </Link>
                <Link
                  href={routes.pricing}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Tarifs
                </Link>
              </>
            )}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link href={routes.auth.login}>
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link href={routes.auth.register}>
                  <Button size="sm">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}



