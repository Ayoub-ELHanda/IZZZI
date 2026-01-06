import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8F8F8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '600px',
        }}
      >
        <h1
          style={{
            fontFamily: 'Mochiy Pop One, sans-serif',
            fontSize: '48px',
            fontWeight: 400,
            color: '#2F2E2C',
            marginBottom: '24px',
            lineHeight: '1.2',
          }}
        >
          Vous n&apos;allez pas collecter beaucoup d&apos;avis ici...
        </h1>
        
        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            color: '#6B6B6B',
            marginBottom: '40px',
          }}
        >
          Il semble que cette page n&apos;existe pas ou ait été supprimée.
        </p>

        <Link
          href="/"
          style={{
            textDecoration: 'none',
          }}
        >
          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#FFD93D',
              color: '#2F2E2C',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              fontWeight: 400,
              padding: '16px 32px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Revenir à l&apos;accueil
            <ArrowUpRight size={20} strokeWidth={2} />
          </button>
        </Link>
      </div>
    </div>
  );
}
