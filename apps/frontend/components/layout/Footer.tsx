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
    <footer className="relative w-full border-0" style={{ borderTop: 'none', borderBottom: 'none', backgroundColor: 'transparent' }}>
      {/* Hashtag Section */}
      <HashtagSection backgroundClassName="bg-white" />
      
      {/* Footer Content */}
      <div className="bg-primary-dark w-full text-white" style={{ borderTop: 'none' }}>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
            {/* Logo - Left */}
            <div className="lg:col-span-3 flex justify-center lg:justify-start">
              <Image 
                src="/logo-footer.svg"
                alt="izzzi logo"
                width={133}
                height={62}
                style={{
                  height: 'auto',
                  width: 'auto',
                  maxHeight: '62px',
                }}
                className="h-[50px] md:h-[62px] w-auto"
              />
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
            <div className="flex justify-end items-center gap-4" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#FFFFFF' }}>
              <Link href="/legal/mentions" className="text-white hover:text-white/80 transition-colors">
                Mentions légales
              </Link>
              <Link href="/legal/faq" className="text-white hover:text-white/80 transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

