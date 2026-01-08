'use client';

import { Badge } from '@/components/ui/Badge';

interface SubscriptionDetailsCardProps {
  plan: string;
  amount: number;
  paymentMethod: string;
  nextPaymentDate: string;
}

export function SubscriptionDetailsCard({
  plan,
  amount,
  paymentMethod,
  nextPaymentDate
}: SubscriptionDetailsCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm w-full"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      <div
        className="w-fit"
        style={{
          height: '40px',
          backgroundColor: '#FFE552',
          borderRadius: '30px',
          padding: '8px 24px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span 
          className="font-poppins"
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#2F2E2C',
            whiteSpace: 'nowrap'
          }}
        >
          ✨ Super Izzzi
        </span>
      </div>
      <h2 
        className="font-mochiy"
        style={{
          fontSize: '16px',
          fontWeight: 400,
          color: '#2F2E2C',
          lineHeight: '18px',
          marginBottom: '4px'
        }}
      >
        Détail de votre abonnement
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span 
              className="font-poppins"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#2F2E2C'
              }}
            >
              Plan
            </span>
            <span 
              className="font-poppins"
              style={{
                fontSize: '14px',
                fontWeight: 400,
                color: '#2F2E2C',
                whiteSpace: 'nowrap'
              }}
            >
              {plan}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span 
              className="font-poppins"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#2F2E2C'
              }}
            >
              Moyen de paiement
            </span>
            <span 
              className="font-poppins"
              style={{
                fontSize: '14px',
                fontWeight: 400,
                color: '#2F2E2C',
                whiteSpace: 'nowrap'
              }}
            >
              {paymentMethod}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span 
              className="font-poppins"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#2F2E2C'
              }}
            >
              Montant payé
            </span>
            <span 
              className="font-poppins"
              style={{
                fontSize: '14px',
                fontWeight: 400,
                color: '#2F2E2C',
                whiteSpace: 'nowrap'
              }}
            >
              {amount}€ TTC
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span 
              className="font-poppins"
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#2F2E2C'
              }}
            >
              Prochain paiement
            </span>
            <span 
              className="font-poppins"
              style={{
                fontSize: '14px',
                fontWeight: 400,
                color: '#2F2E2C',
                whiteSpace: 'nowrap'
              }}
            >
              {nextPaymentDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
