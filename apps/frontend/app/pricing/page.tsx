'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { CardIzzy } from '@/components/ui/CardIzzy';
import { CardSuperIzzy } from '@/components/ui/CardSuperIzzy';
import { PlanTableau } from '@/components/ui/PlanTableau';
import { routes } from '@/config/routes';
import { useAuth } from '@/hooks/useAuth';

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="bg-white min-h-screen">
     
      <div 
        className="relative w-full"
        style={{
          backgroundColor: '#F5F5F5',
          paddingTop: '120px',
          paddingBottom: '350px' 
        }}
      >
        <div style={{ width: '100%', maxWidth: '1764px', paddingLeft: '16px', paddingRight: '16px', margin: '0 auto' }}>
          <div className="text-center relative">
            <h1 
              className="font-mochiy text-3xl text-center"
              style={{
                color: '#2F2E2C',
                lineHeight: '100%',
                letterSpacing: '0%'
              }}
            >
              Deux plans. Zéro friction.
            </h1>
            
            <div className="absolute top-1/2 right-1/4 -mt-10">
              <Image 
                src="/Flcèhe.svg" 
                alt="Flèche" 
                width={84}
                height={86}
                className="w-20 h-20"
              />
            </div>
            
            <p 
              className="mt-4 mx-auto"
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                color: '#6B7280',
                maxWidth: '400px'
              }}
            >
              Commencez gratuitement et passez au niveau supérieur quand vous êtes prêts.
            </p>

        
            <div 
              className="flex items-center mt-8 mx-auto"
              style={{
                width: '328px',
                height: '67px',
                backgroundColor: '#FBFBFB',
                border: '1px solid #E0E0E0',
                borderRadius: '8px',
                padding: '10px 40px 10px 10px',
                gap: '30px'
              }}
            >
              <div
                style={{
                  width: '181px',
                  height: '47px',
                  backgroundColor: '#2F2E2C',
                  borderRadius: '8px',
                  padding: '18px 40px 18px 30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <span
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-poppins), Poppins, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    letterSpacing: '0%'
                  }}
                >
                  Annuel -30%
                </span>
              </div>
              
              <Link href="/pricing-mensuel" style={{ textDecoration: 'none' }}>
                <span
                  style={{
                    width: '67px',
                    height: '11px',
                    color: '#2F2E2C',
                    fontFamily: 'var(--font-poppins), Poppins, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  Mensuel
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

   
      <div 
        className="bg-white"
        style={{
          marginTop: '-270px', 
          paddingBottom: '80px'
        }}
      >
        <div 
          style={{
            width: '100%',
            maxWidth: '1764px',
            margin: '0 auto',
            paddingLeft: '16px',
            paddingRight: '16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '32px'
          }}
        >
          <CardIzzy isAuthenticated={isAuthenticated} />
          <CardSuperIzzy isAnnual={true} isAuthenticated={isAuthenticated} />
        </div>
      </div>
     
      {!isAuthenticated && (
        <>
          <div className="bg-white py-16">
        <div 
          style={{
            width: '1067.29px',
            margin: '0 auto',
            marginBottom: '40px',
          }}
        >
          <h2 
            style={{
              fontFamily: 'Mochiy Pop One',
              fontWeight: 400,
              fontSize: '32px',
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#2F2E2C',
              textAlign: 'left',
            }}
          >
            Comparez nos plans
          </h2>
        </div>

        <PlanTableau isAnnual={true} />
      </div>
        </>
      )}
    </div>
  );
}
