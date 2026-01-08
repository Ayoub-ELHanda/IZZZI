'use client';

import { Button } from './Button';
import { ArrowUpRight } from 'lucide-react';

interface PlanTableauProps {
  isAnnual?: boolean;
}

interface FeatureRow {
  name: string;
  izzzi: string;
  superIzzzi: string;
  height: number;
}

const features: FeatureRow[] = [
  {
    name: 'Nombre de classes actives',
    izzzi: 'Illimité',
    superIzzzi: 'Illimité',
    height: 70,
  },
  {
    name: 'Matières par classe',
    izzzi: 'Illimité',
    superIzzzi: 'Illimité',
    height: 76,
  },
  {
    name: 'Retours visibles par matière',
    izzzi: '5 par matière (après 4 mois)',
    superIzzzi: 'Illimité',
    height: 70,
  },
  {
    name: 'Retours au-delà',
    izzzi: 'Enregistrés, masqués',
    superIzzzi: 'Visibles',
    height: 70,
  },
  {
    name: 'Anonymat des retours',
    izzzi: 'Oui (obligatoire)',
    superIzzzi: 'Oui + levée possible (bientôt disponible)',
    height: 76,
  },
  {
    name: 'Envoi automatique du formulaire',
    izzzi: 'Non',
    superIzzzi: 'Oui (début + fin) (bientôt disponible)',
    height: 70,
  },
  {
    name: 'Relance manuelle (bientôt)',
    izzzi: 'Oui',
    superIzzzi: 'Oui',
    height: 76,
  },
  {
    name: 'Export CSV',
    izzzi: 'Oui',
    superIzzzi: 'Oui',
    height: 76,
  },
  {
    name: 'QR code & lien d\'accès',
    izzzi: 'Oui',
    superIzzzi: 'Oui',
    height: 76,
  },
  {
    name: 'IA - alertes négatives',
    izzzi: 'Oui',
    superIzzzi: 'Oui',
    height: 76,
  },
  {
    name: 'IA - alertes positives',
    izzzi: 'Oui',
    superIzzzi: 'Oui',
    height: 73,
  },
  {
    name: 'Traite des alertes',
    izzzi: 'Oui (commentaire possible)',
    superIzzzi: 'Oui + réponse auto par IA',
    height: 73,
  },
  {
    name: 'Branding personnalisé',
    izzzi: 'Non',
    superIzzzi: 'Oui (bientôt disponible)',
    height: 73,
  },
  {
    name: 'Suppression du logo Izzzi',
    izzzi: 'Non',
    superIzzzi: 'Oui (bientôt disponible)',
    height: 73,
  },
];

export function PlanTableau({ isAnnual = true }: PlanTableauProps) {
  
  const monthlyPricePerClass = 19;

  const annualPricePerClass = Math.round(monthlyPricePerClass * 0.7);

  const pricePerClass = isAnnual ? annualPricePerClass : monthlyPricePerClass;
  
  return (
    <div
      style={{
        width: '1067.29px',
        margin: '0 auto',
        marginTop: '64px',
        position: 'relative',
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          height: '237px',
          backgroundColor: '#FBFBFB',
          borderBottom: '1px solid #E0E0E0',
        }}
      >
        <div></div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              fontFamily: 'Mochiy Pop One, sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              color: '#2F2E2C',
            }}
          >
            Izzzi
          </div>
          <div
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#6B6B6B',
            }}
          >
            <span style={{ fontSize: '24px', fontWeight: 600, color: '#2F2E2C' }}>0€</span> par mois
          </div>
          <Button
            variant="register"
            style={{
              width: '246.29px',
              height: '56px',
            }}
          >
            Demander l'essai gratuit
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </Button>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              fontFamily: 'Mochiy Pop One, sans-serif',
              fontSize: '18px',
              fontWeight: 400,
              color: '#2F2E2C',
            }}
          >
            Super Izzzi
          </div>
          <div
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#6B6B6B',
              textAlign: 'center',
            }}
          >
            à partir de<br />
            <span style={{ fontSize: '24px', fontWeight: 600, color: '#2F2E2C' }}>{pricePerClass}€</span> par mois / classe
          </div>
          <Button
            variant="register"
            style={{
              width: '246.29px',
              height: '56px',
            }}
          >
            Je choisis ce plan
            <ArrowUpRight size={16} strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {features.map((feature, index) => (
        <div
          key={index}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            height: `${feature.height}px`,
            borderBottom: index === features.length - 1 ? 'none' : '1px solid #E0E0E0',
          }}
        >
          
          <div
            style={{
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'Mochiy Pop One, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#2F2E2C',
            }}
          >
            {feature.name}
          </div>

          <div
            style={{
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#6B6B6B',
            }}
          >
            {feature.izzzi}
          </div>

          <div
            style={{
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontWeight: 400,
              color: '#6B6B6B',
            }}
          >
            {feature.superIzzzi}
          </div>
        </div>
      ))}
    </div>
  );
}
