import { Button } from './Button';
import Link from 'next/link';
import { routes } from '@/config/routes';
import Image from 'next/image';

interface CardIzzyProps {
  isAuthenticated?: boolean;
}

export function CardIzzy({ isAuthenticated = false }: CardIzzyProps) {
  return (
    <div 
      style={{
        width: '555px',
        minHeight: isAuthenticated ? '722px' : '906px',
        backgroundColor: '#FBFBFB',
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
        padding: '40px 60px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >

      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '135px',
            height: '50px',
            borderRadius: '30px',
            border: '1px solid #E0E0E0',
            background: '#FFF'
          }}
        >
          <span style={{
            fontFamily: 'Mochiy Pop One',
            fontSize: '14px',
            fontWeight: 400,
            color: '#2F2E2C'
          }}>
            Izzzi
          </span>
        </div>
        
        {isAuthenticated && (
          <div 
            style={{
              display: 'inline-flex',
              padding: '8px 16px',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '6px',
              background: 'white',
              border: '2px solid #F69D04',
              width: 'fit-content'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#F69D04" strokeWidth="2"/>
              <path d="M12 8V12" stroke="#F69D04" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="#F69D04"/>
            </svg>
            <span style={{
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: 600,
              color: '#F69D04'
            }}>
              Plan actuel
            </span>
          </div>
        )}
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
            0€
          </span>
          <span style={{
            fontFamily: 'Poppins',
            fontSize: '12px',
            fontWeight: 700,
            color: '#2F2E2C',
            lineHeight: '100%'
          }}>
            /mois
          </span>
        </div>
      </div>

      {!isAuthenticated && (
        <div style={{ marginBottom: '24px' }}>
          <Link href={routes.auth.register} style={{ textDecoration: 'none', display: 'block' }}>
            <Button 
              variant="yellow"
              style={{
                width: '337.29px',
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
                padding: '16px 26px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <span>Démarrer mes 4 mois gratuits</span>
              <Image 
                src="/ArrowV.svg" 
                alt="Flèche" 
                width={16} 
                height={16}
              />
            </Button>
          </Link>
        </div>
      )}

      <div style={{ marginBottom: '24px', flex: '1' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { text: "4 mois d'essai illimités", subtext: "(matières, classes, retours)" },
            { text: "Puis 5 retours visibles par matière", subtext: "(les autres sont enregistrés mais masqués)" },
            { text: "Anonymat garanti pour tous les retours" },
            { text: "Relance manuelle possible", subtext: "(bouton à cliquer)" },
            { text: "Export des retours en CSV à tout moment" },
            { text: "QR code généré automatiquement" },
            { text: "IA avancée", subtext: "(alertes négatives & alertes positives)" },
            { text: "Page de suivi des alertes", subtext: "(notifications, commentaires possibles)" }
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
                  lineHeight: '150%'
                }}>
                  {item.text}
                </span>
                {item.subtext && (
                  <span style={{
                    fontFamily: 'Poppins',
                    fontSize: '12px',
                    color: '#999999',
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

  
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{
          fontFamily: 'Poppins',
          fontSize: '12px',
          fontWeight: 600,
          color: '#2F2E2C',
          margin: '0 0 12px 0'
        }}>
          Au-delà des 4 mois :
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            "Vos classes restent actives",
            "Les retours visibles sont limités à 5 par matière"
          ].map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: '2px' }}>
                <path d="M20 6L9 17L4 12" stroke="#2F2E2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{
                fontFamily: 'Poppins',
                fontSize: '16px',
                color: '#2F2E2C',
                lineHeight: '150%'
              }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!isAuthenticated && (
        <div style={{ marginTop: 'auto' }}>
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
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
          >
            Voir les détails du plan
            <Image 
              src="/ArrowV.svg" 
              alt="Flèche" 
              width={16} 
              height={16}
            />
          </Button>
        </div>
      )}
    </div>
  );
}
