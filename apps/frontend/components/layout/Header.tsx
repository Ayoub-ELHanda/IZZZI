// Header component
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { routes } from '@/config/routes';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white">
      <div className="flex h-20 items-center justify-between px-6">
        {/* Logo à gauche */}
        <Link href={routes.home} className="flex items-center">
          <Image 
            src="/Logo.svg" 
            alt="IZZZI" 
            width={112}
            height={53}
            className="h-auto"
          />
        </Link>

        {/* Navigation à droite */}
        <div className="flex items-center" style={{ gap: '40px' }}>
          {/* Nos tarifs */}
          <Link
            href={routes.pricing}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: '16px',
              color: '#2F2E2C',
              textDecoration: 'none'
            }}
          >
            Nos tarifs
          </Link>

          {!isAuthenticated && (
            <>
              {/* S'inscrire Button */}
              <Link href={routes.auth.register}>
                <Button variant="register" size="register">
                  S'inscrire
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

              {/* Se connecter Button */}
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
