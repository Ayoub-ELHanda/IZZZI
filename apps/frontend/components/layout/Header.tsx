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
import { ArrowUpRight, Bell, Menu, X } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationsModal } from "@/components/modals/NotificationsModal";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const isSubscriptionPage = pathname === "/pricing";
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const { unreadCount } = useNotifications();

  // Éviter les problèmes d'hydratation en ne rendant le badge que côté client
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push(routes.home);
  };

  // Close mobile menu when pathname changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (mobileMenuOpen && !target.closest('nav') && !target.closest('[style*="position: fixed"]')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [mobileMenuOpen]);

  // During SSR or before hydration, show a neutral header to avoid mismatch
  if (!isMounted) {
    return (
      <header style={{ position: 'relative', width: '100%' }}>
        <nav 
          className="fixed top-2 left-4 right-4 flex items-center justify-between bg-white rounded-lg backdrop-blur-[12px] z-50 shadow-sm border border-[#E5E5E5] px-4 py-2 sm:top-4 sm:left-8 sm:right-8 sm:px-8 sm:py-3"
        >
          <Link 
            href={routes.home} 
            prefetch={true} 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <Image 
              src="/logo-izzzi.svg"
              alt="izzzi logo"
              width={86}
              height={41}
              style={{
                height: 'auto',
                width: 'auto',
                maxHeight: '41px',
              }}
              className="h-[32px] md:h-[41px] w-auto"
            />
          </Link>
          <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
            {/* Placeholder to maintain layout during SSR */}
          </div>
        </nav>
      </header>
    );
  }

  // If authenticated, show header with same style as home page but with authenticated content
  if (isAuthenticated) {
    const isDashboardPage = pathname === "/dashboard";
    const isClassesPage = pathname?.startsWith("/classes") || pathname?.startsWith("/create-class");

    return (
      <header style={{ position: 'relative', width: '100%' }}>
        <nav 
          className="fixed top-2 left-4 right-4 flex items-center justify-between bg-white rounded-lg backdrop-blur-[12px] z-50 shadow-sm border border-[#E5E5E5] px-4 py-2 sm:top-4 sm:left-8 sm:right-8 sm:px-8 sm:py-3"
        >
          {/* Logo - Left */}
          <Link 
            href={routes.home} 
            prefetch={true} 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0,
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image 
              src="/logo-izzzi.svg"
              alt="izzzi logo"
              width={86}
              height={41}
              style={{
                height: 'auto',
                width: 'auto',
                maxHeight: '41px',
              }}
              className="h-[32px] md:h-[41px] w-auto"
            />
          </Link>

          {/* Navigation buttons - Centered - Desktop only */}
          <div 
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              gap: '12px',
            }}
            className="hidden md:flex md:items-center"
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

          {/* Right side - Profile and Actions - Desktop only */}
          <div 
            style={{ 
              gap: '8px',
              flex: 1,
              marginLeft: 'auto',
            }}
            className="hidden md:flex items-center justify-end gap-4"
          >
            {/* Bell icon with notification badge */}
            <button
              onClick={() => setIsNotificationsModalOpen(true)}
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
                position: 'relative',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#F8F8F8';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
            >
              <Bell size={20} color="#2F2E2C" strokeWidth={1.5} />
              {isMounted && unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#FF6B35',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start', justifyContent: 'center' }}>
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
                {user?.role === 'SUPER_ADMIN' ? (
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
                    Super Admin
                  </span>
                ) : user?.subscriptionStatus === 'ACTIVE' || user?.subscriptionStatus === 'TRIALING' ? (
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      width: '122px',
                      height: '32px',
                      backgroundColor: '#F26103',
                      borderRadius: '38px',
                      padding: '0 12px',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2L4 7V12C4 16.97 7.84 21.5 12 22C16.16 21.5 20 16.97 20 12V7L12 2Z"/>
                      <path d="M12 2L4 7V12C4 16.97 7.84 21.5 12 22C16.16 21.5 20 16.97 20 12V7L12 2Z" fill="none" stroke="white" strokeWidth="1"/>
                    </svg>
                    <span 
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        lineHeight: '1',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Super Izzzi
                    </span>
                  </div>
                ) : (
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
                    Plan Gratuit
                  </span>
                )}
              </div>
            </Link>

      
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

          {/* Menu Button - Yellow button with MENU text - Mobile only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden items-center justify-center gap-2"
            style={{
              padding: '10px 16px',
              backgroundColor: '#FFE552',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              flexShrink: 0,
              marginLeft: 'auto',
              border: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FFE566';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFE552';
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2F2E2C',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              MENU
            </span>
            {mobileMenuOpen ? (
              <X size={18} color="#2F2E2C" strokeWidth={2} />
            ) : (
              <Menu size={18} color="#2F2E2C" strokeWidth={2} />
            )}
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              top: '72px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'calc(100% - 16px)',
              maxWidth: '1200px',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              border: '1px solid #E5E5E5',
              zIndex: 49,
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
            className="sm:top-24 sm:w-[calc(100%-32px)]"
          >
            {/* Navigation Links */}
            <Link 
              href="/classes/my-classes" 
              prefetch={true} 
              style={{ textDecoration: 'none' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <button
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: isClassesPage ? '#2F2E2C' : '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: isClassesPage ? '#FFFFFF' : '#2F2E2C',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Mes classes
              </button>
            </Link>
            <Link 
              href="/dashboard" 
              prefetch={true} 
              style={{ textDecoration: 'none' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <button
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: isDashboardPage ? '#2F2E2C' : '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: isDashboardPage ? '#FFFFFF' : '#2F2E2C',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Dashboard
              </button>
            </Link>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#E5E5E5', margin: '8px 0' }} />

            {/* Notifications */}
            <button
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#2F2E2C',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Bell size={20} color="#2F2E2C" strokeWidth={1.5} />
              Notifications
            </button>

            {/* User Profile */}
            <Link 
              href={routes.account.profile}
              prefetch={false}
              style={{ 
                textDecoration: 'none',
                width: '100%',
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <div
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E5E5',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
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
                <div className="flex flex-col">
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
                  {user?.role === 'SUPER_ADMIN' ? (
                    <span 
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#6B6B6B',
                        lineHeight: '1.2',
                      }}
                    >
                      Super Admin
                    </span>
                  ) : user?.subscriptionStatus === 'ACTIVE' || user?.subscriptionStatus === 'TRIALING' ? (
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: '6px',
                        width: 'fit-content',
                        height: '24px',
                        backgroundColor: '#F26103',
                        borderRadius: '38px',
                        padding: '0 10px',
                        marginTop: '2px',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2L4 7V12C4 16.97 7.84 21.5 12 22C16.16 21.5 20 16.97 20 12V7L12 2Z"/>
                        <path d="M12 2L4 7V12C4 16.97 7.84 21.5 12 22C16.16 21.5 20 16.97 20 12V7L12 2Z" fill="none" stroke="white" strokeWidth="1"/>
                      </svg>
                      <span 
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          lineHeight: '1',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Super Izzzi
                      </span>
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>
            </Link>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: '#E5E5E5', margin: '8px 0' }} />

            {/* Logout Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                border: '1px solid #E5E5E5',
                borderRadius: '8px',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#2F2E2C',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              Déconnexion
            </button>
          </div>
        )}

        {/* Notifications Modal */}
        {isAuthenticated && (
          <NotificationsModal
            isOpen={isNotificationsModalOpen}
            onClose={() => setIsNotificationsModalOpen(false)}
          />
        )}
      </header>
    );
  }


  return (
    <header style={{ position: 'relative', width: '100%' }}>
      <nav 
        className="fixed top-2 left-4 right-4 flex items-center justify-between bg-white rounded-lg backdrop-blur-[12px] z-50 shadow-sm border border-[#E5E5E5] px-4 py-2 sm:top-4 sm:left-8 sm:right-8 sm:px-8 sm:py-3"
      >
        {/* Logo */}
        <Link 
          href={routes.home} 
          prefetch={true}
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            textDecoration: 'none',
            flexShrink: 0,
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <Image 
            src="/logo-izzzi.svg"
            alt="izzzi logo"
            width={86}
            height={41}
            style={{
              height: 'auto',
              width: 'auto',
              maxHeight: '41px',
            }}
            className="h-[32px] md:h-[41px] w-auto"
          />
        </Link>

        {/* Desktop Navigation - Visible on desktop */}
        <div 
          className="hidden md:flex items-center gap-4 flex-1 justify-end"
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
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '100%',
                height: '2px',
                backgroundColor: '#F26103',
                borderRadius: '1px',
              }}
            />
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

        {/* Menu Button - Yellow button with MENU text - Mobile only */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden items-center justify-center gap-2 flex-shrink-0"
          style={{
            padding: '10px 16px',
            backgroundColor: '#FFE552',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFE566';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFE552';
          }}
        >
          <span
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              color: '#2F2E2C',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            MENU
          </span>
          {mobileMenuOpen ? (
            <X size={18} color="#2F2E2C" strokeWidth={2} />
          ) : (
            <Menu size={18} color="#2F2E2C" strokeWidth={2} />
          )}
        </button>

      </nav>

      {/* Mobile Menu Overlay - Public */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 16px)',
            maxWidth: '1200px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid #E5E5E5',
            zIndex: 49,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
          className="sm:top-24 sm:w-[calc(100%-32px)]"
        >
          <Link
            href={routes.pricing}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              color: '#2F2E2C',
              textDecoration: 'none',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: isSubscriptionPage ? '#F8F8F8' : 'transparent',
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Nos tarifs
          </Link>

          <Link 
            href={routes.auth.register} 
            style={{ textDecoration: 'none' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <button
              style={{
                width: '100%',
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
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              S&rsquo;inscrire
              <ArrowUpRight size={16} color="#2F2E2C" strokeWidth={2} />
            </button>
          </Link>

          <Link 
            href={routes.auth.login} 
            style={{ textDecoration: 'none' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <button
              style={{
                width: '100%',
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
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              Se connecter
              <ArrowUpRight size={16} color="#2F2E2C" strokeWidth={2} />
            </button>
          </Link>
        </div>
      )}
      </header>
    );
  }

export default Header;
