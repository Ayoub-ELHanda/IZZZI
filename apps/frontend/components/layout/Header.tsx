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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F2E2C" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </button>
                
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#FFE552',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#2F2E2C',
                  }}
                >
                  YC
                </div>
              </div>
            </>
          ) : (
            <>
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
