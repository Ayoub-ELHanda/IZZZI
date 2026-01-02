'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { routes } from '@/config/routes';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/assets/Logo';

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push(routes.auth.login);
  };

  return (
    <header className="bg-white">
      <div className="flex h-20 items-center justify-between px-6">
        <Link href={routes.home} className="flex items-center">
          <Image 
            src="/Logo.svg" 
            alt="IZZZI" 
            width={112}
            height={53}
            className="h-auto"
          />
        </Link>

        <div className="flex items-center" style={{ gap: '40px' }}>
          {isAuthenticated ? (
            <>
              <div 
                className="flex items-center gap-4"
                style={{
                  width: '346px',
                  height: '71px',
                  backgroundColor: '#D9D9D9',
                  borderRadius: '8px',
                  padding: '10px',
                }}
              >
                <Link href="/classes">
                  <button
                    style={{
                      width: '176px',
                      height: '51px',
                      backgroundColor: '#FBFBFB',
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      color: '#2F2E2C',
                      cursor: 'pointer',
                    }}
                  >
                    Mes classes
                  </button>
                </Link>
                <Link href="/dashboard">
                  <button
                    style={{
                      width: '176px',
                      height: '51px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      color: '#2F2E2C',
                      cursor: 'pointer',
                    }}
                  >
                    Dashboard
                  </button>
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <button
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#F4F4F4',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Matières
                </Link>
                <Link href={routes.account.profile} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  {user?.profilePicture ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                      <img
                        src={user.profilePicture}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
                      {user?.firstName?.charAt(0).toUpperCase() || ''}{user?.lastName?.charAt(0).toUpperCase() || ''}
                    </div>
                  )}
                  <span className="text-sm text-gray-700">
                    {user?.firstName} {user?.lastName}
                  </span>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </Link>

              <Link href={routes.auth.login}>
                <Button variant="login" size="login">
                  Se connecter
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    style={{ marginLeft: '1.99px' }}
                  >
                    <path d="M7 17l9.2-9.2M17 17V7H7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
