import Link from 'next/link';
import { AlertCircle, ArrowUpRight } from 'lucide-react';

export interface TrialBannerProps {
  message1: string;
  message2: string;
  linkText: string;
  linkHref: string;
}

export function TrialBanner({ message1, message2, linkText, linkHref }: TrialBannerProps) {
  return (
    <div
      style={{
        width: '680px',
        backgroundColor: '#FFF4E0',
        border: '1px solid #FFE552',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '56px',
        display: 'flex',
        alignItems: 'center',
        gap: '56px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <AlertCircle size={20} color="#FF9500" />
        <div>
          <p style={{ width: '311px', height: '26px', fontFamily: 'Poppins, sans-serif', fontSize: '12px', fontWeight: 600, color: '#FF9500' }}>
            {message1}
          </p>
          <p style={{ width: '311px', height: '26px', fontFamily: 'Poppins, sans-serif', fontSize: '12px', fontWeight: 600, color: '#FF9500' }}>
            {message2}
          </p>
        </div>
      </div>
      
      <Link href={linkHref} style={{ textDecoration: 'none' }}>
        <span
          style={{
            width: '247px',
            height: '16px',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '14px',
            color: '#FF9500',
            textDecoration: 'underline',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {linkText.replace('→', '').trim()}
          <ArrowUpRight size={16} color="#FF9500" style={{ marginLeft: '4px' }} />
        </span>
      </Link>
    </div>
  );
}
