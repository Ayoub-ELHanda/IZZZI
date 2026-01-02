'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { routes } from '@/config/routes';
import { Bell } from 'lucide-react';

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push(routes.auth.login);
  };

  return (
    <header 
      style={{
        position: 'relative',
        width: '100%',
        height: '80px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E5E5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
      }}
    >
      {/* Logo - Left */}
      <div style={{ flex: '1' }}>
        <Link href={routes.home} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', width: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#2F2E2C',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <span 
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '24px',
                fontWeight: 600,
                color: '#2F2E2C',
              }}
            >
              izzzi
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation buttons - Absolutely centered */}
      {isAuthenticated && (
        <div 
          style={{ 
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', 
            gap: '12px',
            zIndex: 1,
          }}
        >
          <Link href="/classes/my-classes">
            <button
              style={{
                padding: '10px 24px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#2F2E2C',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#F8F8F8';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              Mes classes
            </button>
          </Link>
          <Link href="/dashboard">
            <button
              style={{
                padding: '10px 24px',
                backgroundColor: '#2F2E2C',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#2F2E2C';
              }}
            >
              Dashboard
            </button>
          </Link>
        </div>
      )}

      {/* Right side - Profile and Actions */}
      {isAuthenticated ? (
        <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '24px' }}>
          {/* Bell icon */}
          <button
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#F8F8F8';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Bell size={20} color="#2F2E2C" strokeWidth={1.5} />
          </button>

          {/* User profile */}
          <Link 
            href={routes.account.profile} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {user?.profilePicture ? (
              <div 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  backgroundColor: '#E5E5E5',
                }}
              >
                <img
                  src={user.profilePicture}
                  alt={`${user.firstName} ${user.lastName}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ) : (
              <div 
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#E5E5E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#2F2E2C',
                }}
              >
                {user?.firstName?.charAt(0).toUpperCase() || ''}{user?.lastName?.charAt(0).toUpperCase() || ''}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span 
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#2F2E2C',
                  lineHeight: '1.2',
                }}
              >
                {user?.firstName} {user?.lastName}
              </span>
              <span 
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#6B6B6B',
                  lineHeight: '1.2',
                }}
              >
                Plan gratuit
              </span>
            </div>
          </Link>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#F8F8F8';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Déconnexion
          </button>
        </div>
      ) : (
        <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
          <Link href={routes.auth.login}>
            <button
              style={{
                padding: '10px 24px',
                backgroundColor: '#2F2E2C',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#2F2E2C';
              }}
            >
              Se connecter
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M7 17l9.2-9.2M17 17V7H7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
