'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ClassesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="text-center relative">
          <h1 
            className="font-mochiy text-center"
            style={{
              width: '318px',
              height: '69px',
              fontSize: '32px',
              fontWeight: 400,
              lineHeight: '100%',
              letterSpacing: '0%',
              marginBottom: '60px',
            }}
          >
            Pour commencer, créez une classe
          </h1>
          
    <div
  className="absolute"
  style={{
    width: '178px',
    height: '54px',
    top: '-80px',
    right: '-100px',
    transform: 'rotate(-12.18deg)',
    fontFamily: 'Caveat, cursive',
    fontSize: '22px',
    fontWeight: 400,
    lineHeight: '100%',
    letterSpacing: '0%',
    textAlign: 'center',
    color: '#2F2E2C',
  }}
>
  Vous allez voir,<br />
  c&apos;est <span style={{ textDecoration: 'underline' }}>izziic</span> !
</div>

          <div>
            <Link href="/create-class">
              <Button
                style={{
                  width: '246.29px',
                  height: '56px',
                  backgroundColor: '#FFE552',
                  color: '#2F2E2C',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                Je crée une classe
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
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
