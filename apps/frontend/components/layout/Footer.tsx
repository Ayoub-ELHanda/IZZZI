"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HashtagSection from "./HashtagSection";

export function Footer() {
  const pathname = usePathname();
  const isSuperAdminPage = pathname?.startsWith("/super-admin");

  // Don't show footer on super admin pages
  if (isSuperAdminPage) {
    return null;
  }

  return ( 
    <footer className="relative w-full">
      {/* Hashtag Section */}
      <HashtagSection backgroundClassName="bg-white" />
      
      {/* Footer Content */}
      <div className="bg-primary-dark w-full text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
            {/* Logo - Left */}
            <div className="lg:col-span-3 flex justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#F26103">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <span 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#FFFFFF',
                  }}
                >
                  izzzi
                </span>
              </div>
            </div>
            
            {/* Spacer */}
            <div className="hidden lg:block lg:col-span-5"></div>
            
            {/* Plan du site - Middle */}
            <div className="lg:col-span-2 text-center lg:text-left">
              <h3 
                style={{
                  fontFamily: 'Mochiy Pop One, sans-serif',
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  marginBottom: '24px',
                }}
              >
                Plan du site
              </h3>
              <div className="flex flex-col gap-4" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px' }}>
                <Link href="/pricing" className="text-white hover:text-white/80 transition-colors">
                  Nos tarifs
                </Link>
                <Link href="/auth/register" className="text-white hover:text-white/80 transition-colors">
                  S'inscrire
                </Link>
                <Link href="/auth/login" className="text-white hover:text-white/80 transition-colors">
                  Se connecter
                </Link>
              </div>
            </div>
            
            {/* Nous contacter - Right */}
            <div className="lg:col-span-2 text-center lg:text-left">
              <h3 
                style={{
                  fontFamily: 'Mochiy Pop One, sans-serif',
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  marginBottom: '24px',
                }}
              >
                Nous contacter
              </h3>
              <div className="inline-flex border border-white rounded-lg px-6 lg:px-10 py-5 items-center justify-center w-auto">
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px', color: '#FFFFFF' }}>
                  hello@izzzi.io
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Links */}
        <div>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#FFFFFF' }}>
              <Link href="/legal-notice" className="text-white hover:text-white/80 transition-colors">
                Mentions légales
              </Link>
              <Link href="/faq" className="text-white hover:text-white/80 transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

