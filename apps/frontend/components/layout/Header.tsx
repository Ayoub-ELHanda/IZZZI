"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { routes } from "@/config/routes";
import images from "@/constants/images";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, Bell } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const isSubscriptionPage = pathname === "/pricing";

  const handleLogout = async () => {
    await logout();
    router.push(routes.home);
  };

  // If authenticated, show header with same style as home page but with authenticated content
  if (isAuthenticated) {
    const isDashboardPage = pathname === "/dashboard";
    const isClassesPage = pathname?.startsWith("/classes") || pathname?.startsWith("/create-class");

    return (
      <header style={{ position: 'relative', width: '100%' }}>
        <nav 
          style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            backdropFilter: 'blur(12px)',
            zIndex: 50,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E5E5E5',
            maxWidth: '1200px',
            width: 'calc(100% - 32px)',
            padding: '12px 16px',
          }}
        >
          {/* Logo - Left */}
          <Link 
            href={routes.home} 
            prefetch={true} 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div 
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#2F2E2C',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
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
                whiteSpace: 'nowrap',
              }}
            >
              izzzi
            </span>
          </Link>

          {/* Navigation buttons - Centered */}
          <div 
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
            className="hidden md:flex"
          >
            <Link href="/classes/my-classes" prefetch={true} style={{ textDecoration: 'none' }}>
              <button
                style={{
                  padding: '10px 24px',
                  backgroundColor: isClassesPage ? '#2F2E2C' : '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: isClassesPage ? '#FFFFFF' : '#2F2E2C',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseOver={(e) => {
                  if (!isClassesPage) {
                    e.currentTarget.style.backgroundColor = '#F8F8F8';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isClassesPage) {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }
                }}
              >
                Mes classes
              </button>
            </Link>
            <Link href="/dashboard" prefetch={true} style={{ textDecoration: 'none' }}>
              <button
                style={{
                  padding: '10px 24px',
                  backgroundColor: isDashboardPage ? '#2F2E2C' : '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: isDashboardPage ? '#FFFFFF' : '#2F2E2C',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseOver={(e) => {
                  if (!isDashboardPage) {
                    e.currentTarget.style.backgroundColor = '#F8F8F8';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isDashboardPage) {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }
                }}
              >
                Dashboard
              </button>
            </Link>
          </div>

          {/* Right side - Profile and Actions */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-end', 
              gap: '16px',
              flex: 1,
              marginLeft: 'auto',
            }}
            className="hidden md:flex"
          >
            {/* Bell icon */}
            <button
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                flexShrink: 0,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#F8F8F8';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <Bell size={20} color="#2F2E2C" strokeWidth={1.5} />
            </button>

            {/* User profile */}
            <Link 
              href={routes.account.profile}
              prefetch={false}
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
                    flexShrink: 0,
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
                    flexShrink: 0,
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
                    whiteSpace: 'nowrap',
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
                    whiteSpace: 'nowrap',
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
                whiteSpace: 'nowrap',
                flexShrink: 0,
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
        </nav>
      </header>
    );
  }

  // Public header with new design - matching Figma exactly
  return (
    <header style={{ position: 'relative', width: '100%' }}>
      <nav 
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          backdropFilter: 'blur(12px)',
          zIndex: 50,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E5E5E5',
          maxWidth: '1200px',
          width: 'calc(100% - 32px)',
          padding: '12px 16px',
        }}
      >
        {/* Logo */}
        <Link 
          href={routes.home} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div 
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#2F2E2C',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
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
              whiteSpace: 'nowrap',
            }}
          >
            izzzi
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flex: 1,
            justifyContent: 'flex-end',
          }}
          className="hidden md:flex"
        >
          <Link
            href={routes.pricing}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              color: '#2F2E2C',
              textDecoration: 'none',
              position: 'relative',
              display: 'inline-block',
              paddingBottom: '4px',
            }}
          >
            Nos tarifs
            {isSubscriptionPage && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '100%',
                  height: '2px',
                  backgroundColor: '#FF6B35',
                  borderRadius: '1px',
                }}
              />
            )}
          </Link>

          <Link href={routes.auth.register} style={{ textDecoration: 'none' }}>
            <button
              style={{
                padding: '14px 20px',
                backgroundColor: '#FFD93D',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2F2E2C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFE566';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFD93D';
              }}
            >
              S&rsquo;inscrire
              <ArrowUpRight size={16} color="#2F2E2C" strokeWidth={2} />
            </button>
          </Link>

          <Link href={routes.auth.login} style={{ textDecoration: 'none' }}>
            <button
              style={{
                padding: '14px 20px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2F2E2C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F5F5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              Se connecter
              <ArrowUpRight size={16} color="#2F2E2C" strokeWidth={2} />
            </button>
          </Link>
        </div>

      </nav>
      </header>
    );
  }

export default Header;
