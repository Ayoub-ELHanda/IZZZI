'use client';

import { Badge } from './Badge';
import { Button } from './Button';
import { Slider } from './Slider';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { useState } from 'react';

export function CardSuperIzzy() {
  const [classCount, setClassCount] = useState(7);
  

  const pricePerClass = 19;
  const totalPrice = classCount * pricePerClass;
  return (
    <div 
      style={{
        width: '521px',
        minHeight: '972px',
        backgroundColor: '#F69D04',
        border: '1px solid rgba(244, 244, 244, 0.05)',
        borderRadius: '8px',
        padding: '60px 73px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: 'relative',
        boxSizing: 'border-box',
        color: 'white'
      }}
    >

      <div style={{ marginBottom: '32px' }}>
        <Badge variant="yellow">Super Izzzi</Badge>
      </div>
      
   
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ 
          fontFamily: 'Poppins',
          fontWeight: 700,
          fontSize: '16px',
          lineHeight: '100%',
          color: '#2F2E2C',
          marginBottom: '16px'
        }}>
          Estimez le prix de votre abonnement
        </h3>
        
 
        <div style={{ marginBottom: '32px' }}>
     
          <div style={{ marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Slider
                defaultValue={[7]}
                min={1}
                max={20}
                step={1}
                onValueChange={(value) => setClassCount(value[0])}
                className="w-full"
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                marginTop: '8px',
                opacity: 0.75,
                color: '#2F2E2C'
              }}>
                <span>1</span>
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>+20</span>
              </div>
            </div>
          </div>
          
         
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{
                fontFamily: 'Mochiy Pop One',
                fontSize: '58px',
                fontWeight: 400,
                color: '#2F2E2C',
                lineHeight: '125%'
              }}>
                {totalPrice}€
              </span>
              <span style={{
                fontFamily: 'Poppins',
                fontSize: '12px',
                fontWeight: 700,
                color: '#2F2E2C',
                lineHeight: '100%',
                marginLeft: '8px'
              }}>
                par mois / par classe
              </span>
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <Link href={routes.auth.register} style={{ textDecoration: 'none', display: 'block', width: '239.29px' }}>
            <Button 
              variant="yellow"
              style={{
                width: '100%',
                height: '56px',
                backgroundColor: '#FFE552',
                color: '#2F2E2C',
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 24px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              Je choisis ce plan
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </Link>
        </div>
      </div>
      
 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{
          fontFamily: 'Poppins',
          fontSize: '16px',
          fontWeight: 700,
          color: '#2F2E2C',
          lineHeight: '100%',
          marginBottom: '16px'
        }}>
          Tout ce qu'il y a dans le plan gratuit,<br/>
          et en plus :
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { text: "Nombre de retours illimité" },
            { 
              text: "IA générative pour répondre aux alertes",
              subtext: "(un mail prêt à envoyer en un clic)"
            },
            { 
              text: "Levée d'anonymat activée par l'étudiant",
              subtext: "(Bientôt disponible)"
            },
            { 
              text: "Formulaires personnalisables",
              subtext: "(Bientôt disponible)"
            },
            { 
              text: "Envoie automatique du formulaire",
              subtext: "(Bientôt disponible)"
            },
            { 
              text: "Branding personnalisé (couleurs, logo)",
              subtext: "Au début et à la fin du cours (Bientôt disponible)"
            },
            { 
              text: "Suppression du logo IZZI",
              subtext: "(Bientôt disponible)"
            }
          ].map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: '2px' }}>
                <path d="M20 6L9 17L4 12" stroke="#2F2E2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontFamily: 'Poppins',
                  fontSize: '16px',
                  color: '#2F2E2C',
                  lineHeight: '150%',
                }}>
                  {item.text}
                </span>
                {item.subtext && (
                  <span style={{
                    fontFamily: 'Poppins',
                    fontSize: '12px',
                    color: '#2F2E2C',
                    lineHeight: '150%',
                    marginTop: '2px'
                  }}>
                    {item.subtext}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
  
      <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
        <Button 
          variant="outline"
          style={{
            width: '278.29px',
            height: '56px',
            backgroundColor: 'transparent',
            color: '#2F2E2C',
            fontFamily: 'Poppins',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
            border: '1px solid #2F2E2C',
            borderRadius: '8px',
            cursor: 'pointer',
            boxSizing: 'border-box'
          }}
        >
          Voir les détails du plan
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
      </div>
    </div>
  );
}
