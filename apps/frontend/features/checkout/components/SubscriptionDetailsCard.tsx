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
      className="bg-white rounded-lg shadow-sm"
      style={{
        width: '557px',
        height: '317px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      {/* Badge */}
      <div
        style={{
          width: '186px',
          height: '50px',
          backgroundColor: '#FFE552',
          borderRadius: '30px',
          padding: '10px 40px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span 
          className="font-poppins"
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#2F2E2C',
            whiteSpace: 'nowrap'
          }}
        >
          ✨ Super Izzzi
        </span>
      </div>

      {/* Titre */}
      <h2 
        className="font-mochiy"
        style={{
          fontSize: '18px',
          fontWeight: 400,
          color: '#2F2E2C',
          lineHeight: '18px',
          marginBottom: '8px'
        }}
      >
        Détail de votre abonnement
      </h2>

      {/* Détails */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Ligne 1: Plan + Moyen de paiement (alignés horizontalement) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Plan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span 
              className="font-poppins"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#2F2E2C'
              }}
            >
              Plan
            </span>
            <span 
              className="font-poppins"
              style={{
                fontSize: '16px',
                fontWeight: 400,
                color: '#2F2E2C',
                whiteSpace: 'nowrap'
              }}
            >
              {plan}
            </span>
          </div>

          {/* Moyen de paiement */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span 
              className="font-poppins"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#2F2E2C'
              }}
            >
              Moyen de paiement
            </span>
            <span 
              className="font-poppins"
              style={{
                fontSize: '16px',
                fontWeight: 400,
                color: '#2F2E2C',
                whiteSpace: 'nowrap'
              }}
            >
              {paymentMethod}
            </span>
          </div>
        </div>

        {/* Ligne 2: Montant payé + Prochain paiement (alignés horizontalement) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Montant payé */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span 
              className="font-poppins"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#2F2E2C'
              }}
            >
              Montant payé
            </span>
            <span 
              className="font-poppins"
              style={{
                fontSize: '16px',
                fontWeight: 400,
                color: '#2F2E2C',
                whiteSpace: 'nowrap'
              }}
            >
              {amount}€ TTC
            </span>
          </div>

          {/* Prochain paiement */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span 
              className="font-poppins"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#2F2E2C'
              }}
            >
              Prochain paiement
            </span>
            <span 
              className="font-poppins"
              style={{
                fontSize: '16px',
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
